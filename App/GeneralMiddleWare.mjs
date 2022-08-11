import geoIp from "geoip-country";

// console.log = function () {};
// console.warn = function () {};
// console.error = function () {};

export default async (
  CountriesDB,
  ActivationCodesDB,
  SerialsDB,
  ClientsDB,
  TagsDB,
  SettingsDB,
  SystemUsersDB,
  PeriodsDB
) => {
  return async (req, res, next) => {
    const Range = req.header("range") || req.header("Range");
    let Tag = req.header("Tag") ? req.header("Tag") : req.query.Tag;
    if (!Tag) {
      Tag = req.header("tag") ? req.header("tag") : req.query.tag;
    }

    const TagToken = Verify(Tag);
    if (!TagToken) {
      console.warn(`Tag ${TagToken} is not valid`);
      return res.status(401).sendStatus(401);
    }

    const TagKey =
      TagToken?.string ||
      TagToken?.name ||
      TagToken?.key ||
      TagToken?.Tag ||
      "";

    let ip;

    if (
      req.headers["cf-connecting-ip"] &&
      req.headers["cf-connecting-ip"].split(", ").length
    ) {
      let first = req.headers["cf-connecting-ip"].split(", ");
      ip = first[0];
    } else {
      ip =
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    }

    if (ip == "::1") {
      ip = "Default";
    }

    const geo = ip == "Default" ? { country: "JO" } : geoIp.lookup(ip);
    res.header("Country", geo?.country);
    res.header("IP", ip);

    console.error(ip, geo?.country);

    let SerialNumber = TagToken?.SerialNumber
      ? TagToken?.SerialNumber
      : req.header("SerialNumber")
      ? req.header("SerialNumber")
      : req?.query?.SerialNumber;

    if (!SerialNumber) {
      SerialNumber = req.header("serialnumber")
        ? req.header("serialnumber")
        : req.query.serialnumber;
    }

    let MacAddress = TagToken?.MacAddress
      ? TagToken?.SerialNumber
      : req.header("MacAddress")
      ? req.header("MacAddress")
      : req?.query?.MacAddress;

    if (!MacAddress) {
      MacAddress = req.header("macaddress")
        ? req.header("macaddress")
        : req.query?.macaddress;
    }

    let HeaderCode = req.header("Code") ? req.header("Code") : req?.query?.Code;

    if (!HeaderCode) {
      HeaderCode = req.header("code") ? req.header("code") : req.query?.code;
    }

    res.header("Code", HeaderCode);

    const SettingsQuery = await SettingsDB.find({}).toArray();

    const {
      UnAuhtorized,
      NotFound,
      BlockedClient,
      BlockedCountry,
      PointsDeductionType,
      MessageForExpiration,
    } = SettingsQuery[0] ? SettingsQuery[0] : {};

    if (!Range) {
      if (!TagToken || !TagKey) {
        console.log(`Tag2`, SerialNumber, MacAddress, HeaderCode, TagToken);

        return res.status(401).json({ message: UnAuhtorized })?.end?.();
      }

      const Data = await TagsDB.findOne({ Tag: TagKey });

      if (Data?.used && Data?.used >= 3) {
        console.log(`Tag1`);

        console.log(req.headers);
        return res.status(401).json({ message: UnAuhtorized })?.end?.();
      }

      if (Data) {
        try {
          await TagsDB.updateOne(
            { Tag: TagKey },
            {
              $inc: { used: 1 },
            }
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        await TagsDB.insertOne({
          Tag: TagKey,
          IP: ip,
          used: 0,
          Country: geo?.country,
          CreatedAt: new Date(),
        });
      }
    }

    const Country = await CountriesDB.findOne({
      Code: new RegExp(geo?.country ? geo?.country : "JO", "gim"),
    });

    const SerialQuery = await SerialsDB.findOne({
      Code: HeaderCode,
      Serial: SerialNumber,
    });

    if (Country?.Blocked && !SerialQuery)
      return res.status(403).json({ message: BlockedCountry })?.end?.();

    const ClientQuery = await ClientsDB.findOne({
      $or: [
        {
          Code: HeaderCode,
          MacAddress: MacAddress,
          SerialNumber: SerialNumber,
        },
      ],
    });

    const {
      ExpireAt: DateToExpireIn,
      ClientCreatedAt,
      ClientCode,
      Blocked,
      IP,
      CountryCode,
    } = ClientQuery ? ClientQuery : {};

    if (Blocked)
      return res.status(403).json({ message: BlockedClient })?.end?.();

    let ExpireDate = new Date();
    if (!HeaderCode || !MacAddress || !SerialNumber) {
      console.log(
        `!HeaderCode || !MacAddress || !SerialNumber: ${
          !HeaderCode || !MacAddress || !SerialNumber
        }`
      );

      console.log(HeaderCode, MacAddress, SerialNumber);

      return res.status(401).json({ message: UnAuhtorized })?.end?.();
    }

    const CodeQuery = await ActivationCodesDB.findOne({
      Code: HeaderCode,
    });

    const {
      Code,
      Period: PeriodInDays,
      Points: Points,
      CreatedAt,
      Limit: CodeLimits,
    } = CodeQuery ? CodeQuery : {};

    if (!Code || Code !== HeaderCode) {
      console.log(`Code !== HeaderCode: ${Code !== HeaderCode}`);

      return res.status(401).json({ message: UnAuhtorized })?.end?.();
    }

    const {
      Serial,
      Period: SerialPeriodInDays,
      Points: SerialPoints,
      CreatedAt: SerialCreatedAt,
      Code: SerialCode,
    } = SerialQuery ? SerialQuery : {};

    let IsExpired = false;

    if (Serial && SerialCode && ClientQuery) {
      //Check if the serial is expired using SerialCreatedAt and SerialPeriodInDays, If the number of days is passed than the createdAt is expired
      const SerialExpiredAt = new Date(SerialCreatedAt);
      SerialExpiredAt.setDate(SerialExpiredAt.getDate() + SerialPeriodInDays);
      ExpireDate = SerialExpiredAt;
      const Now = new Date();
      if (Now > SerialExpiredAt) {
        IsExpired = true;
      }
    } else {
      ExpireDate = new Date(DateToExpireIn);

      if (!ClientQuery) {
        const CodeActivitedCount = await ClientsDB.count({
          Code: HeaderCode,
        });
        if (CodeActivitedCount >= CodeLimits) {
          return res.status(401).json({ message: UnAuhtorized })?.end?.();
        } else {
          //ExpireAt is Current date added with PeriodInDays
          const ExpireAt = new Date();

          const Serial = await SerialsDB.findOne({
            Serial: SerialNumber,
          });

          const Codes = await ActivationCodesDB.findOne({
            Code: HeaderCode,
          });

          const CreatedBy = Serial?.CreatedBy
            ? Serial?.CreatedBy
            : Codes?.CreatedBy;

          let PeriodSelected = Serial?.CreatedBy
            ? SerialPeriodInDays
            : PeriodInDays;

          console.log(`Activated Client: ${SerialPeriodInDays}`);

          let PointsSelected = Serial?.CreatedBy ? SerialPoints : Points;

          let SubscriptionType = Serial?.CreatedBy ? "Serial" : "Code";

          ExpireAt.setDate(
            ExpireAt.getDate() +
              (Serial?.CreatedBy ? SerialPeriodInDays : PeriodInDays)
          );

          ExpireDate = ExpireAt;
          const TodayDate = new Date();
          //Compare 2 dates and check if the expireAt is passed
          const IsExpiredDate = TodayDate > ExpireAt;

          if (IsExpiredDate) {
            IsExpired = true;
          }

          const PeriodDataQuery = await PeriodsDB.findOne({
            Period: PeriodSelected,
          });

          const { Points: PeriodPoints = 0 } = PeriodDataQuery
            ? PeriodDataQuery
            : {};

          SubscriptionType = Serial?.CreatedBy ? "Serial" : "Code";

          console.log(`Activated Client By Serial: ${JSON.stringify(Serial)}`);

          if (Codes?.Code) {
            if (PointsDeductionType) {
              const SystemUserQuery = await SystemUsersDB.findOne({
                _id: new ObjectId(`${CreatedBy?._id}`),
              });

              if (SystemUserQuery) {
                const { CodesAllowed = [], isAdmin } = SystemUserQuery;

                if (!isAdmin) {
                  if (!CodesAllowed?.includes?.(Codes?._id)) {
                    await SystemUsersDB.updateOne(
                      { _id: new ObjectId(`${CreatedBy?._id}`) },
                      {
                        $inc: { CurrentBalance: -PeriodPoints },
                        //Push a code _id to an array called CodesAllowed
                        $push: { CodesAllowed: Codes?._id },
                      }
                    );
                  } else {
                    await SystemUsersDB.updateOne(
                      { _id: new ObjectId(`${CreatedBy?._id}`) },
                      {
                        $inc: { CurrentBalance: -PeriodPoints },
                      }
                    );
                  }
                }
              }
            } else {
              const SystemUserQuery = await SystemUsersDB.findOne({
                _id: new ObjectId(`${CreatedBy?._id}`),
              });

              if (SystemUserQuery) {
                const { CodesAllowed = [], isAdmin } = SystemUserQuery;

                if (!isAdmin) {
                  if (!CodesAllowed?.includes?.(Codes?._id)) {
                    await SystemUsersDB.updateOne(
                      { _id: new ObjectId(`${CreatedBy?._id}`) },
                      {
                        $push: { CodesAllowed: Codes?._id },
                      }
                    );
                  }
                }
              }
            }

            await ClientsDB.deleteOne({
              SerialNumber: SerialNumber,
            });

            const Client = {
              Code: Codes?.Code,
              MacAddress: MacAddress,
              SerialNumber: SerialNumber,
              CreatedAt: new Date(),
              ExpireAt: ExpireAt,
              Blocked: false,
              IP: ip,
              CreatedBy: Serial?.CreatedBy
                ? Serial?.CreatedBy
                : Codes?.CreatedBy,
              Period: PeriodSelected,
              Points: PointsDeductionType ? PointsSelected : 0,
              CountryCode: geo?.country ? geo?.country : "JO",
              SubscriptionType: SubscriptionType,
              Number: CodeActivitedCount,
            };
            await ClientsDB.insertOne(Client);
          } else {
            return res.status(401).json({ message: NotFound })?.end?.();
          }
        }
      } else {
        //Check if expired using ExpireAt and today's date
        const ClientExpiredAt = new Date(DateToExpireIn);

        ExpireDate = ClientExpiredAt;
        const Now = new Date();
        if (Now > ClientExpiredAt) {
          IsExpired = true;
        }
      }
    }

    if (IsExpired) {
      console.log(`IsExpired: ${IsExpired}`);
      return res
        .status(401)
        .json({
          message: MessageForExpiration ? MessageForExpiration : UnAuhtorized,
        })
        ?.end?.();
    }

    res.header(
      "expiration_date",
      `Expire at: ${ExpireDate.toISOString().split("T")[0]}`
    );

    next();
  };
};

import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
const Secret = process.env.ClientJWT_SECRET;

const Verify = (Token) => {
  try {
    return jwt.verify(Token, Secret);
  } catch (error) {
    return undefined;
  }
};
