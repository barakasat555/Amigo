import express from "express";
import Dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";
import { ObjectId } from "mongodb";

// console.log = function () {};
// console.warn = function () {};
// console.error = function () {};

const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.SystemUsers;
const CategoriesDB = RootDB.Categories;
const SubCategoriesDB = RootDB.SubCategories;
const SeriesDB = RootDB.Series;
const EpisodesDB = RootDB.Episodes;
const CodesDB = RootDB.ActivationCodes;
const SerialsDB = RootDB.Serials;
const ClientsDB = RootDB.Clients;
const PeriodsDB = RootDB.Periods;
const ClientDB = RootDB.Clients;
const CountriesDB = RootDB.Countries;
const SystemUsersDB = RootDB.SystemUsers;
const MoviesDB = RootDB.Movies;
const LivesDB = RootDB.Live;
const SettingsDB = RootDB.Settings;
const SessionDB = RootDB.Sessions;
const ImagesDB = RootDB.Images;
const LiveViewsDB = RootDB.LiveViews;

router.post("/SignIn", async (req, res) => {
  const { Username, Password } = req.body;
  const AdminQuery = await DB.findOne(
    {
      Username: Username,
      Password: Password,
    },
    {
      projection: {
        Password: 0,
      },
    }
  );
  const { _id, isAdmin } = AdminQuery ? AdminQuery : {};

  if (_id)
    return res
      .status(200)
      .json({ Token: Sign({ _id: `${_id}` }), isAdmin: isAdmin })
      ?.end?.();

  res.status(404).sendStatus(404)?.end?.()?.end?.();
});

router.post("/ValidateToken", async (req, res) => {
  const { Token } = req.body;
  if (Verify(Token)) return res.status(200).json({ Valid: true })?.end?.();

  res.status(401).sendStatus(401)?.end?.();
});

router.post("/Categories-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 1000 } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await CategoriesDB.count({});
  const Categories = await CategoriesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, Categories: Categories, Valid: true })
    ?.end?.();
});

router.post("/Countries-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 6 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Countries") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await CountriesDB.count({});
  const Countries = await CountriesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, Countries: Countries, Valid: true })
    ?.end?.();
});

router.post("/Countries-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Countries") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await CountriesDB.count({
    Name: new RegExp(Query.trim(), "gim"),
  });

  const Countries = await CountriesDB.find({
    Name: new RegExp(Query.trim(), "gim"),
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, Countries: Countries, Valid: true })
    ?.end?.();
});

router.post("/Users-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 0 } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Users") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await SystemUsersDB.count({});

  const Users = await SystemUsersDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  const NewUsers = [];
  for (let index = 0; index < Users.length; index++) {
    const element = Users[index];
    const SeriesCount = await SeriesDB.count({
      "CreatedBy._id": `${element?._id}`,
    });

    const EpisodesCount = await EpisodesDB.count({
      "CreatedBy._id": `${element?._id}`,
    });

    element.SeriesCount = SeriesCount;
    element.EpisodesCount = EpisodesCount;

    const Codes = await CodesDB.find({
      "CreatedBy._id": `${element?._id}`,
    }).toArray();

    let Spent = 0;
    for (let index = 0; index < Codes.length; index++) {
      const { Points = 0 } = Codes[index];
      Spent += Points;
    }

    element.Spent = Spent;
    NewUsers.push(element);
  }

  res.status(200).json({ Count: Count, Users: NewUsers, Valid: true })?.end?.();
});

// router.post("/Users-By-ID", async (req, res) => {
//   const { Token, ID } = req.body;
//   if (!Verify(Token)) return res.status(401).sendStatus(401)?.end?.();

//   const Count = await SystemUsersDB.count({_id: new Object(ID)});

//   const Users = await SystemUsersDB.find({})
//     .skip(Skip)
//     .limit(Number(Limit))
//     .toArray();

//   res.status(200).json({ Count: Count, Users: Users, Valid: true })?.end?.()
// });

router.post("/Users-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Users") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await SystemUsersDB.count({
    Username: new RegExp(Query.trim(), "gim"),
  });

  const Users = await SystemUsersDB.find({
    Username: new RegExp(Query.trim(), "gim"),
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  const NewUsers = [];
  let Spent = 0;

  for (let index = 0; index < Users.length; index++) {
    const element = Users[index];
    const SeriesCount = await SeriesDB.count({
      "CreatedBy._id": `${element?._id}`,
    });

    const EpisodesCount = await EpisodesDB.count({
      "CreatedBy._id": `${element?._id}`,
    });

    element.SeriesCount = SeriesCount;
    element.EpisodesCount = EpisodesCount;

    const Codes = await CodesDB.find({
      "CreatedBy._id": `${element?._id}`,
    }).toArray();

    let Spent = 0;
    for (let index = 0; index < Codes.length; index++) {
      const { Points = 0 } = Codes[index];
      Spent += Points;
    }

    element.Spent = Spent;

    NewUsers.push(element);
  }

  res.status(200).json({ Count: Count, Users: NewUsers, Valid: true })?.end?.();
});

router.post("/Series-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await SeriesDB.count({});
  const Series = await SeriesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const NewSeries = [];
  for (let index = 0; index < Series.length; index++) {
    const element = Series[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ TypeID: `${element?._id}` });
    element.Views = Sessions;
    NewSeries.push(element);
  }

  res
    .status(200)
    .json({ Count: Count, Series: NewSeries, Valid: true })
    ?.end?.();
});

router.post("/Settings", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Settings") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!IsUserAdmin) {
    const Settings = await SettingsDB.find({}).toArray();

    const { Logo, CodeLength, NumberOfRows, AppName, AlertOnPoints } =
      Settings[0];
    res
      .status(200)
      .json({
        Settings: { Logo, CodeLength, NumberOfRows, AppName, AlertOnPoints },
        Valid: true,
      })
      ?.end?.();
  } else {
    if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

    const Settings = await SettingsDB.find({}).toArray();

    res.status(200).json({ Settings: Settings[0], Valid: true })?.end?.();
  }
});

router.post("/Edit-Settings", async (req, res) => {
  const { Token, Settings: SettingsEdited = {} } = req.body;
  if (!SettingsEdited) return res.status(400).sendStatus(400);
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Settings") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Settings = await SettingsDB.updateMany(
    {},
    {
      $set: SettingsEdited,
    }
  );

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Series-Episodes-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await EpisodesDB.count({});
  const Episodes = await EpisodesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const NewEpisodes = [];
  for (let index = 0; index < Episodes.length; index++) {
    const element = Episodes[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;
    NewEpisodes.push(element);
  }

  res
    .status(200)
    .json({ Count: Count, Episodes: NewEpisodes, Valid: true })
    ?.end?.();
});

router.post("/Movies-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Movies") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await MoviesDB.count({});
  const Movies = await MoviesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const New = [];
  for (let index = 0; index < Movies.length; index++) {
    const element = Movies[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;
    New.push(element);
  }

  res.status(200).json({ Count: Count, Movies: New, Valid: true })?.end?.();
});

router.post("/Movies-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Movies") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await MoviesDB.count({
    Name: new RegExp(Query.trim(), "gim"),
  });
  const Movies = await MoviesDB.find({
    Name: new RegExp(Query.trim(), "gim"),
  })
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const New = [];
  for (let index = 0; index < Movies.length; index++) {
    const element = Movies[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;
    New.push(element);
  }

  res.status(200).json({ Count: Count, Movies: New, Valid: true })?.end?.();
});

router.post("/Lives-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await LivesDB.count({});
  const Lives = await LivesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const New = [];
  for (let index = 0; index < Lives.length; index++) {
    const element = Lives[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;
    const ViewsStart = await LiveViewsDB.count({ ID: `${element?._id}` });
    element.LiveViews = ViewsStart;
    New.push(element);
  }

  const OfflineCount = await LivesDB.count({
    Status: false,
  });

  const OnlineCount = await LivesDB.count({
    Status: true,
  });
  res
    .status(200)
    .json({ Count: Count, Lives: New, OfflineCount, OnlineCount, Valid: true })
    ?.end?.();
});

router.post("/Media-Views", async (req, res) => {
  const { Token, type, RType, MediaID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (
      (Priv?.Name == "Lives" && type == "Live") ||
      (Priv?.Name == "Movies" && type == "Movie") ||
      (Priv?.Name == "Series" && type == "episode")
    ) {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Views = [];
  if (RType == "yes") {
    Views = await LivesDB.find({}).toArray();
  } else {
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    Views = await LivesDB.find({}).toArray();
  }

  res.status(200).json({ Views, Valid: true })?.end?.();
});

router.post("/Media-Views-By-Type-ID", async (req, res) => {
  const { Token, ID, Type, IsRealTime } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (
      (Priv?.Name == "Lives" && Type == "Lives") ||
      (Priv?.Name == "Movies" && Type == "Movies") ||
      (Priv?.Name == "Series" && Type == "Episodes") ||
      (Priv?.Name == "Series" && Type == "Series")
    ) {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Views = [];
  if (IsRealTime == "true" || IsRealTime === true) {
    Views = await LiveViewsDB.find({ ID: `${ID}` }).toArray();
  } else {
    Views = await SessionDB.find(
      Type == "Series" ? { TypeID: `${ID}` } : { EpisodeID: `${ID}` }
    ).toArray();
  }

  res.status(200).json({ Views, Valid: true })?.end?.();
});

router.post("/Lives-Status", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
    Status: UserStatus,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserStatus.length; index++) {
    let Priv = UserStatus[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const OfflineCount = await LivesDB.count({
    Status: false,
  });

  const OnlineCount = await LivesDB.count({
    Status: true,
  });
  res
    .status(200)
    .json({
      OfflineCount: OfflineCount,
      OnlineCount: OnlineCount,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Lives-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Count = 0;
  let Lives = [];
  if (Query?.toLowerCase?.() == "offline" || Query?.toLowerCase?.() == "off") {
    Count = await LivesDB.count({
      Status: false,
    });
    Lives = await LivesDB.find({
      Status: false,
    })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
  } else {
    if (Query?.toLowerCase?.() == "online" || Query?.toLowerCase?.() == "on") {
      Count = await LivesDB.count({
        Status: true,
      });
      Lives = await LivesDB.find({
        Status: true,
      })
        .skip(Skip)
        .limit(Number(Limit))
        .sort({ _id: -1 })
        .toArray();
    } else {
      Count = await LivesDB.count({
        Name: new RegExp(Query.trim(), "gim"),
      });
      Lives = await LivesDB.find({
        Name: new RegExp(Query.trim(), "gim"),
      })
        .skip(Skip)
        .limit(Number(Limit))
        .sort({ _id: -1 })
        .toArray();
    }
  }

  const New = [];
  for (let index = 0; index < Lives.length; index++) {
    const element = Lives[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;

    const ViewsStart = await LiveViewsDB.count({ ID: `${element?._id}` });
    element.LiveViews = ViewsStart;

    New.push(element);
  }

  const OfflineCount = await LivesDB.count({
    Status: false,
  });

  const OnlineCount = await LivesDB.count({
    Status: true,
  });
  res
    .status(200)
    .json({
      Count: Count,
      Lives: New,
      OfflineCount: OfflineCount,
      OnlineCount: OnlineCount,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Series-Episodes-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await EpisodesDB.count({
    Name: new RegExp(Query.trim(), "gim"),
  });
  const Episodes = await EpisodesDB.find({
    Name: new RegExp(Query.trim(), "gim"),
  })
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const NewEpisodes = [];
  for (let index = 0; index < Episodes.length; index++) {
    const element = Episodes[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ EpisodeID: `${element?._id}` });
    element.Views = Sessions;
    NewEpisodes.push(element);
  }

  res
    .status(200)
    .json({ Count: Count, Episodes: NewEpisodes, Valid: true })
    ?.end?.();
});

router.post("/Series-By-ID", async (req, res) => {
  const { Token, SeriesID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Episodes = await EpisodesDB.find({ Series: `${SeriesID}` })
    .sort({ _id: -1 })
    .toArray();

  const Series = await SeriesDB.findOne({ _id: new ObjectId(SeriesID) });

  res
    .status(200)
    .json({
      Episode: Episodes?.length >= 1 ? Episodes[0] : Series,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Series-Fragment-Episodes-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "", SeriesID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Series = {};
  let Count = 0;
  let Episodes = [];
  if (SeriesID) {
    Series = await SeriesDB.findOne({ _id: new ObjectId(Query) });
    Count = await EpisodesDB.count({ Series: `${Series?._id}` });
    Episodes = await EpisodesDB.find({ Series: `${Series?._id}` })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
  } else {
    Count = await EpisodesDB.count({ Name: new RegExp(Query, "gim") });
    Episodes = await EpisodesDB.find({ Name: new RegExp(Query, "gim") })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
  }

  res
    .status(200)
    .json({ Count: Count, Episodes: Episodes, Valid: true })
    ?.end?.();
});

router.post("/SubCategories-Series-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 1000 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = await CategoriesDB.findOne({
    Name: `Series`,
  });

  const Count = await SubCategoriesDB.count({
    Category: `${_id}`,
  });
  const SubCategories = await SubCategoriesDB.find({
    Category: `${_id}`,
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, SubCategories: SubCategories, Valid: true })
    ?.end?.();
});

router.post("/SubCategories-Lives-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 1000 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = await CategoriesDB.findOne({
    Name: `IPTV`,
  });

  const Count = await SubCategoriesDB.count({
    Category: `${_id}`,
  });
  const SubCategories = await SubCategoriesDB.find({
    Category: `${_id}`,
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, SubCategories: SubCategories, Valid: true })
    ?.end?.();
});

router.post("/SubCategories-Movies-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 1000 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = await CategoriesDB.findOne({
    Name: `Movies`,
  });
  const Count = await SubCategoriesDB.count({
    Category: `${_id}`,
  });
  const SubCategories = await SubCategoriesDB.find({
    Category: `${_id}`,
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, SubCategories: SubCategories, Valid: true })
    ?.end?.();
});

router.post("/Categories-By-Type", async (req, res) => {
  const { Token, Type = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Categories = await CategoriesDB.find({
    Type: Type,
  }).toArray();

  res.status(200).json({ Categories: Categories, Valid: true })?.end?.();
});

router.post("/Codes-Manual", async (req, res) => {
  const { Token, Skip = 0, Limit = 20 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Codes = await CodesDB.find({
    isGenerate: false,
  })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res.status(200).json({ Codes: Codes, Valid: true })?.end?.();
});

router.post("/SubCategories-Count", async (req, res) => {
  const { Token, Skip = 0, Limit = 1000 } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await SubCategoriesDB.count({});
  let SubCategoriesFromDB = await SubCategoriesDB.find({})
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const SubCategories = [];
  for (let index = 0; index < SubCategoriesFromDB?.length; index++) {
    const element = SubCategoriesFromDB[index];
    let Category = {};
    if (element?.Category) {
      Category = await CategoriesDB.findOne({
        _id: new ObjectId(`${element?.Category}`),
      });
    }
    element.CategoryName = Category?.Name;
    SubCategories.push(element);
  }

  SubCategoriesFromDB = undefined;

  res
    .status(200)
    .json({ Count: Count, SubCategories: SubCategories, Valid: true })
    ?.end?.();
});

router.post("/SubCategories-By-Category", async (req, res) => {
  const { Token, CategoryID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let SubCategoriesFromDB = await SubCategoriesDB.find({
    Category: `${CategoryID}`,
  }).toArray();

  res
    .status(200)
    .json({ SubCategories: SubCategoriesFromDB, Valid: true })
    ?.end?.();
});

router.post("/Last-SubCategory", async (req, res) => {
  const { Token, Category = {} } = req.body;
  const { _id } = Category;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let SubCategoryFromDB = await SubCategoriesDB.find({
    Category: `${_id}`,
  })
    .sort({ Position: -1 })
    .limit(0)
    .toArray();

  const { Position = 0 } = SubCategoryFromDB[0] ? SubCategoryFromDB[0] : {};
  res
    .status(200)
    .json({ Position: Position + 1, Valid: true })
    ?.end?.();
});

router.post("/SubCategories-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Count = await SubCategoriesDB.count({
    Name: new RegExp(Query.trim(), "gim"),
  });
  let SubCategoriesFromDB = await SubCategoriesDB.find({
    Name: new RegExp(Query.trim(), "gim"),
  })
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  const SubCategories = [];
  for (let index = 0; index < SubCategoriesFromDB?.length; index++) {
    const element = SubCategoriesFromDB[index];
    let Category = {};
    if (element?.Category) {
      Category = await CategoriesDB.findOne({
        _id: new ObjectId(`${element?.Category}`),
      });
    }
    element.CategoryName = Category?.Name;
    SubCategories.push(element);
  }

  SubCategoriesFromDB = undefined;
  res
    .status(200)
    .json({ Count: Count, SubCategories: SubCategories, Valid: true })
    ?.end?.();
});

router.post("/Series-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Count = await SeriesDB.count({ Name: new RegExp(Query.trim(), "gim") });
  let Series = await SeriesDB.find({ Name: new RegExp(Query.trim(), "gim") })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  if (Series?.length <= 0) {
    const SubCategories = await SubCategoriesDB.findOne({
      Name: new RegExp(Query.trim(), "gim"),
    });

    if (SubCategories?._id) {
      Count = await SeriesDB.count({ SubCategory: `${SubCategories?._id}` });
      Series = await SeriesDB.find({ SubCategory: `${SubCategories?._id}` })
        .skip(Skip)
        .limit(Number(Limit))
        .toArray();
    }
  }

  const NewSeries = [];
  for (let index = 0; index < Series.length; index++) {
    const element = Series[index];
    //EpisodeID
    const Sessions = await SessionDB.count({ TypeID: `${element?._id}` });
    element.Views = Sessions;
    NewSeries.push(element);
  }
  res
    .status(200)
    .json({ Count: Count, Series: NewSeries, Valid: true })
    ?.end?.();
});

router.post("/Delete-Series", async (req, res) => {
  const { Token, SeriesID = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //Remove Client
  await SeriesDB.deleteOne({ _id: new ObjectId(SeriesID) });

  await EpisodesDB.deleteMany({ Series: `${SeriesID}` });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-Movies", async (req, res) => {
  const { Token, MoviesID = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Movies") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //Remove Client
  await MoviesDB.deleteOne({ _id: new ObjectId(MoviesID) });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-Lives", async (req, res) => {
  const { Token, LivesID = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //Remove Client
  await LivesDB.deleteOne({ _id: new ObjectId(LivesID) });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-Episode", async (req, res) => {
  const { Token, EpisodeID = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //Remove Client
  await EpisodesDB.deleteOne({ _id: ObjectId(EpisodeID) });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Categories-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await CategoriesDB.count({ Name: new RegExp(Query, "gim") });
  const Categories = await CategoriesDB.find({ Name: new RegExp(Query, "gim") })
    .skip(Skip)
    .limit(Number(Limit))
    .toArray();

  res
    .status(200)
    .json({ Count: Count, Categories: Categories, Valid: true })
    ?.end?.();
});

router.post("/Codes-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const {
    Privileges: UserPrivileges,
    isAdmin: IsUserAdmin,
    CodesAllowed = [],
  } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await CodesDB.count(
    IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }
  );
  // Order Decending
  let Codes = await CodesDB.find(
    IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }
  )
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  let NewCodes = [];
  for (let index = 0; index < Codes.length; index++) {
    const CodeElement = Codes[index];
    const { Code, _id } = CodeElement;

    let SubCategories = await SubCategoriesDB.find({
      SubCategoriesAllowed: `${_id}`,
    }).toArray();

    CodeElement.SubCategories = SubCategories ? SubCategories : [];

    const UsersCount = await ClientsDB.count({ Code: Code });
    if (UsersCount >= 1 && !IsUserAdmin) {
      NewCodes.push({ ...CodeElement, UsersCount });
    } else {
      NewCodes.push({ ...CodeElement, UsersCount });
    }
  }

  const CodesQueries = [];
  for (let index = 0; index < CodesAllowed.length; index++) {
    const CodeID = CodesAllowed[index];
    if (CodeID) {
      try {
        CodesQueries.push({ _id: new ObjectId(`${CodeID}`) });
      } catch (error) {}
    }
  }

  let codesQuery = [];
  if (CodesQueries?.length >= 1) {
    codesQuery = await CodesDB.find({ $or: CodesQueries }).toArray();
  }

  const NewAllowedCodes = [];

  for (let index = 0; index < codesQuery.length; index++) {
    const CodeElement = codesQuery[index];
    const { Code, _id } = CodeElement;

    let SubCategories = await SubCategoriesDB.find({
      SubCategoriesAllowed: `${_id}`,
    }).toArray();

    CodeElement.SubCategories = SubCategories ? SubCategories : [];

    const UsersCount = await ClientsDB.count({
      Code: Code,
      "CreatedBy._id": UserIDPriv,
    });
    NewAllowedCodes.push({ ...CodeElement, UsersCount });
  }

  NewCodes.push(...NewAllowedCodes);

  res.status(200).json({ Count: Count, Codes: NewCodes, Valid: true })?.end?.();

  NewCodes = undefined;
  Codes = undefined;
});

router.post("/Codes-Export", async (req, res) => {
  const { Token, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
    Export: UserExport = [],
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserExport?.length; index++) {
    let Priv = UserExport[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  if (Query?.length > 0 && !IsUserAdmin)
    return res.status(401).sendStatus(401)?.end?.();

  const queryInstructions = Query.split(":");
  const Username = queryInstructions[0] ? queryInstructions[0] : Query;
  const Type = queryInstructions[1] ? queryInstructions[1] : "txt";
  const Limit = queryInstructions[2] ? Number(queryInstructions[2]) : 0;
  const Skip = queryInstructions[3] ? Number(queryInstructions[3]) : 0;
  const sort = queryInstructions[4] ? Number(queryInstructions[4]) : 1;
  const IncludeHeaders = queryInstructions[5] ? queryInstructions[5] : "no";

  if (Type == "json" && !IsUserAdmin)
    return res.status(401).sendStatus(401)?.end?.();

  let Codes = [];
  if (
    (IsUserAdmin && Query?.length <= 0) ||
    (IsUserAdmin && Username == "ALL")
  ) {
    Codes = await CodesDB.find({})
      .sort({ _id: sort })
      .skip(Skip)
      .limit(Limit)
      .toArray();
  } else if (IsUserAdmin && Query?.length > 0) {
    Codes = await CodesDB.find({ "CreatedBy.Username": Username })
      .sort({ _id: sort })
      .skip(Skip)
      .limit(Limit)
      .toArray();
  } else {
    Codes = await CodesDB.find({ "CreatedBy._id": `${UserIDPriv}` })
      .sort({ _id: sort })
      .skip(Skip)
      .limit(Limit)
      .toArray();
  }

  if (Type == "json") {
    //Send Codes as a json downloadable file to the browser
    const json = JSON.stringify(Codes);

    res.json({ file: json, ext: "json", Valid: true })?.end?.();
  } else {
    let text = "";
    if (IncludeHeaders == "yes") {
      text += `Code,Period,isGenerate,Limit,CreatedAt\n`;
    }
    for (let index = 0; index < Codes.length; index++) {
      const CodeElement = Codes[index];
      const { Code, Period, isGenerate, CreatedAt, Limit } = CodeElement;
      text += `${Code},${Period},${isGenerate},${Limit},${new Date(
        `${CreatedAt}`
      )?.toISOString?.()}\n`;
    }

    res
      .status(200)
      .json({ file: text, ext: Type == "txt" ? "txt" : "csv", Valid: true })
      ?.end?.();
  }
});

router.post("/Codes-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const {
    Privileges: UserPrivileges,
    isAdmin: IsUserAdmin,
    CodesAllowed = [],
  } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();
  if (Query?.includes?.("ALL") && !IsUserAdmin)
    return res.status(401).sendStatus(401)?.end?.();

  let Count = 0;
  let Codes = [];
  if (Query?.includes?.("ALL")) {
    Count = await CodesDB.count({});
    // Order Decending
    Codes = await CodesDB.find({})
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
  } else {
    Count = await CodesDB.count({
      $or: [
        {
          Code: new RegExp(Query, "gim"),
          ...(IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }),
        },
        {
          "CreatedBy.Username": new RegExp(Query, "gim"),
          ...(IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }),
        },
      ],
    });
    // Order Decending
    Codes = await CodesDB.find({
      $or: [
        {
          Code: new RegExp(Query, "gim"),
          ...(IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }),
        },
        {
          "CreatedBy.Username": new RegExp(Query, "gim"),
          ...(IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }),
        },
      ],
    })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
  }

  let NewCodes = [];
  for (let index = 0; index < Codes.length; index++) {
    const CodeElement = Codes[index];
    const { Code, _id } = CodeElement;

    let SubCategories = await SubCategoriesDB.find({
      SubCategoriesAllowed: `${_id}`,
    }).toArray();

    CodeElement.SubCategories = SubCategories ? SubCategories : [];

    const UsersCount = await ClientsDB.count({ Code: Code });
    if (UsersCount >= 1 && !IsUserAdmin) {
      NewCodes.push({ ...CodeElement, UsersCount });
    } else {
      NewCodes.push({ ...CodeElement, UsersCount });
    }
  }

  const CodesQueries = [];
  for (let index = 0; index < CodesAllowed.length; index++) {
    const CodeID = CodesAllowed[index];
    if (CodeID) {
      CodesQueries.push({ _id: new ObjectId(`${CodeID}`) });
    }
  }

  let codesQuery = [];
  if (CodesQueries?.length >= 1) {
    codesQuery = await CodesDB.find({ $or: CodesQueries }).toArray();
  }

  const NewAllowedCodes = [];

  for (let index = 0; index < codesQuery.length; index++) {
    const CodeElement = codesQuery[index];
    const { Code, _id } = CodeElement;

    let SubCategories = await SubCategoriesDB.find({
      SubCategoriesAllowed: `${_id}`,
    }).toArray();

    CodeElement.SubCategories = SubCategories ? SubCategories : [];

    const UsersCount = await ClientsDB.count({
      Code: Code,
      "CreatedBy._id": UserIDPriv,
    });
    NewAllowedCodes.push({ ...CodeElement, UsersCount });
  }

  NewCodes.push(...NewAllowedCodes);

  res.status(200).json({ Count: Count, Codes: NewCodes, Valid: true })?.end?.();

  NewCodes = undefined;
  Codes = undefined;
});

import XLSX from "xlsx";

const XLSXColumnNames = [
  "Code",
  "Mac address",
  "Serial number",
  "Created at",
  "Expire at",
  "Blocked",
  "IP Address",
  "Created by",
  "Period",
  "Points",
  "Country code",
  "Subscription type",
  "Number",
];

router.get("/Download-Expired-Clients", async (req, res) => {
  const { Token, type = "excel" } = req.query;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();
  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if ((!Pass && !IsUserAdmin) || !IsUserAdmin)
    return res.status(401).sendStatus(401)?.end?.();

  const ClientsData = await ClientsDB.find({
    ExpireAt: { $lte: new Date() },
  }).toArray();

  let Clients = Array.isArray(ClientsData) ? ClientsData : [];

  if (type?.toLowerCase?.()?.includes?.("excel")) {
    const NewData = Clients?.map?.(
      ({
        Code = "",
        MacAddress = "",
        SerialNumber = "",
        CreatedAt = new Date(),
        ExpireAt = new Date(),
        Blocked = false,
        IP = "",
        CreatedBy = {},
        Period = {},
        Points = 0,
        CountryCode = "",
        SubscriptionType = "",
        Number = 0,
      }) => {
        return [
          Code,
          MacAddress,
          SerialNumber,
          CreatedAt,
          ExpireAt,
          Blocked ? "Yes" : "No",
          IP,
          CreatedBy?.Username,
          Period?.Period,
          Points,
          CountryCode,
          SubscriptionType,
          Number,
        ];
      }
    );

    const wb = XLSX.utils.book_new();
    const WorkSheetData = [XLSXColumnNames, ...NewData];
    const ws = XLSX.utils.aoa_to_sheet(WorkSheetData, { cellDates: true });
    // console.log(ws)
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    //Convert xlsx to buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    //Convert xls to binary and send it to the client to download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
    res.send(buffer).end?.();
  } else {
    res.status(200).json(Clients);
  }
});

router.post("/Clients-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Count = 0;
  let Clients = [];
  if (IsUserAdmin) {
    Count = await ClientsDB.count({});
    Clients = await ClientsDB.find({})
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();

    const ClientClone = [];
    for (let index = 0; index < Clients.length; index++) {
      const client = Clients[index];
      const SubscriptionType = client?.SubscriptionType;
      if (SubscriptionType == "Serial") {
        const SerialNumber = client?.SerialNumber;
        const SerialNumberQuery = await SerialsDB.findOne(
          {
            Serial: SerialNumber,
          },
          {
            projection: {
              Points: 1,
            },
          }
        );
        client.Points = SerialNumberQuery?.Points
          ? SerialNumberQuery?.Points
          : 0;

        console.log(client.Points);
      }

      ClientClone.push(client);
    }

    Clients = ClientClone;
  } else {
    console.log(
      `UserIDPriv: ${UserIDPriv}, ${JSON.stringify({ _id: `${UserIDPriv}` })}`
    );
    Count = await ClientsDB.count({
      "CreatedBy._id": `${UserIDPriv}`,
    });

    Clients = await ClientsDB.find({
      "CreatedBy._id": `${UserIDPriv}`,
    })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();

    const ClientClone = [];
    for (let index = 0; index < Clients.length; index++) {
      const client = Clients[index];
      const SubscriptionType = client?.SubscriptionType;
      if (SubscriptionType == "Serial") {
        const SerialNumber = client?.SerialNumber;
        const SerialNumberQuery = await SerialsDB.findOne(
          {
            Serial: SerialNumber,
          },
          {
            projection: {
              Points: 1,
            },
          }
        );
        client.Points = SerialNumberQuery?.Points
          ? SerialNumberQuery?.Points
          : 0;

        console.log(client.Points);
      }

      ClientClone.push(client);
    }

    Clients = ClientClone;

    console.log(`Clients Length ${Clients?.length}`);
  }

  res
    .status(200)
    .json({ Count: Count, Clients: Clients, Valid: true })
    ?.end?.();

  Clients = undefined;
});

router.post("/Clients-Count-Search", async (req, res) => {
  const { Token, Skip, Limit, Query } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Count = 0;
  let Clients = [];
  console.log(Query?.toLowerCase?.(), "Search Query");
  if (IsUserAdmin) {
    if (Query?.toLowerCase?.().includes?.("expired")) {
      Count = await ClientsDB.count({
        ExpireAt: { $lte: new Date() },
      });
      //ExpireAt
      Clients = await ClientsDB.find({
        ExpireAt: { $lte: new Date() },
      })
        .skip(Skip)
        .limit(Number(Limit))
        .sort({ _id: -1 })
        .toArray();
    } else {
      Count = await ClientsDB.count({
        $or: [
          { SerialNumber: new RegExp(Query, "gim") },
          { Code: new RegExp(Query, "gim") },
          { MacAddress: new RegExp(Query, "gim") },
        ],
      });

      Clients = await ClientsDB.find({
        $or: [
          { SerialNumber: new RegExp(Query, "gim") },
          { Code: new RegExp(Query, "gim") },
          { MacAddress: new RegExp(Query, "gim") },
        ],
      })
        .skip(Skip)
        .limit(Number(Limit))
        .sort({ _id: -1 })
        .toArray();
    }

    const ClientClone = [];
    for (let index = 0; index < Clients.length; index++) {
      const client = Clients[index];
      const SubscriptionType = client?.SubscriptionType;
      if (SubscriptionType == "Serial") {
        const SerialNumber = client?.SerialNumber;
        const SerialNumberQuery = await SerialsDB.findOne(
          {
            Serial: SerialNumber,
          },
          {
            projection: {
              Points: 1,
            },
          }
        );
        client.Points = SerialNumberQuery?.Points
          ? SerialNumberQuery?.Points
          : 0;

        console.log(client.Points);
      }

      ClientClone.push(client);
    }

    Clients = ClientClone;
  } else {
    Count = await ClientsDB.count({
      $or: [
        {
          SerialNumber: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
        {
          Code: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
        {
          MacAddress: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
      ],
    });
    Clients = await ClientsDB.find({
      $or: [
        {
          SerialNumber: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
        {
          Code: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
        {
          MacAddress: new RegExp(Query, "gim"),
          "CreatedBy._id": `${UserIDPriv}`,
        },
      ],
    })
      .skip(Skip)
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();

    const ClientClone = [];
    for (let index = 0; index < Clients.length; index++) {
      const client = Clients[index];
      const SubscriptionType = client?.SubscriptionType;
      if (SubscriptionType == "Serial") {
        const SerialNumber = client?.SerialNumber;
        const SerialNumberQuery = await SerialsDB.findOne(
          {
            Serial: SerialNumber,
          },
          {
            projection: {
              Points: 1,
            },
          }
        );
        client.Points = SerialNumberQuery?.Points
          ? SerialNumberQuery?.Points
          : 0;

        console.log(client.Points);
      }

      ClientClone.push(client);
    }

    Clients = ClientClone;
  }

  res
    .status(200)
    .json({ Count: Count, Clients: Clients, Valid: true })
    ?.end?.();

  Clients = undefined;
});

router.post("/Delete-Client", async (req, res) => {
  const { Token, ClientID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const ClientQuery = await ClientsDB.findOne({
    _id: ClientID ? new ObjectId(ClientID) : ClientID,
  });

  //Check if the ClientQuery is not empty
  if (!ClientQuery) return res.status(404).sendStatus(404)?.end?.();

  const { Points = 0, CreatedBy = {} } = ClientQuery;

  //Remove Client
  await ClientsDB.deleteOne({ _id: new ObjectId(ClientID) });

  if (Points >= 1) {
    const UpdatedUser = await SystemUsersDB.updateOne(
      { _id: new ObjectId(`${CreatedBy?._id}`) },
      {
        $inc: { CurrentBalance: Points },
      }
    );
  }
  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-Mass-Client", async (req, res) => {
  const { Token, Query = "" } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Clients = [];
  if (Query?.length > 0) {
    Clients = await ClientsDB.find({
      "CreatedBy.Username": Query,
    }).toArray();

    for (let index = 0; index < Clients.length; index++) {
      const Client = Clients[index];
      const { Points = 0, CreatedBy = {} } = Client;

      SystemUsersDB.updateOne(
        { _id: new ObjectId(`${CreatedBy?._id}`) },
        {
          $inc: { CurrentBalance: Points },
        }
      );
    }
    // CreatedBy.Username;
    await ClientsDB.deleteMany({ "CreatedBy.Username": Query });
  } else {
    Clients = await ClientsDB.find({}).toArray();
    //Remove Client
    await ClientsDB.deleteMany({});
  }

  for (let index = 0; index < Clients.length; index++) {
    const Client = Clients[index];
    const { Points = 0, CreatedBy = {} } = Client ? Client : {};

    if (Points >= 1) {
      SystemUsersDB.updateOne(
        { _id: new ObjectId(`${CreatedBy?._id}`) },
        {
          $inc: { CurrentBalance: Points },
        }
      );
    }
  }

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Create-Serials-Mass", async (req, res) => {
  const { Token, Serials } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const SettingsQuery = await SettingsDB.find({}).toArray();
  const { PointsDeductionType = false } = SettingsQuery[0]
    ? SettingsQuery[0]
    : {};

  const {
    Privileges: UserPrivileges,
    isAdmin: IsUserAdmin,
    Points: UserPoints,
  } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserUpload.length; index++) {
    let Priv = UserUpload[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let PointsToDeduct = 0;
  for (let index = 0; index < Serials.length; index++) {
    const Serial = Serials[index];
    Serial.Period = Number(Serial.Period);
    const CheckPeriodQuery = await PeriodsDB.findOne({
      Period: Serial?.Period,
    });

    const { Points } = CheckPeriodQuery ? CheckPeriodQuery : {};
    PointsToDeduct += Points;
  }

  if (
    UserPoints < PointsToDeduct &&
    PointsDeductionType === false &&
    !IsUserAdmin
  )
    return res
      .status(401)
      .json({ LackPoints: true, PointsNeeded: PointsToDeduct - UserPoints })
      ?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { isAdmin, Privileges, Username } = AdminQuery ? AdminQuery : {};

  // if (!isAdmin) return res.status(401).sendStatus(401)?.end?.();

  const NewSerials = [];
  let Broke = false;
  for (let index = 0; index < Serials?.length; index++) {
    const element = Serials[index];
    if (!element) {
      continue;
    }
    element.Period = Number(element.Period);
    const CheckPeriod = await PeriodsDB.findOne({ Period: element?.Period });
    const CheckCode = await CodesDB.findOne({ Code: element?.Code });
    if (!CheckPeriod?.Period || !CheckCode?.Code) {
      Broke = true;
      console.log(element, `Is Broken, ${Broke}`);
      break;
    }
    NewSerials.push({
      ...element,
      Serial: element?.Serial?.trim?.(),
      Points: CheckPeriod.Points,
      ...(!PointsDeductionType ? { Refundable: true } : {}),
      CreatedBy: { Username, _id: _id },
      CreatedAt: new Date(),
    });
  }

  if (Broke) return res.status(401).sendStatus(401)?.end?.();

  let InsertedSerialsCount = 0;
  let InsertedErrors = 0;
  for (let index = 0; index < NewSerials.length; index++) {
    const element = NewSerials[index];

    const NewDateToExpire = new Date();
    NewDateToExpire.setDate(NewDateToExpire.getDate() + element?.Period);

    const ClientsUpdate = await ClientsDB.updateMany(
      {
        $or: [
          { SerialNumber: element?.Serial?.trim?.() },
          { MacAddress: element?.Serial?.trim?.() },
        ],
      },
      {
        $set: {
          Period: element?.Period,
          Points: element?.Points,
          ExpireAt: NewDateToExpire,
          Code: element?.Code,
        },
      }
    );

    if (!IsUserAdmin) {
      if (PointsDeductionType) {
        element.Refundable = false;
        const IsClientQuery = await ClientsDB.count({
          $or: [
            { SerialNumber: element?.Serial?.trim?.() },
            { MacAddress: element?.Serial?.trim?.() },
          ],
        });

        if (IsClientQuery >= 1) {
          await SystemUsersDB.updateOne(
            { _id: new ObjectId(_id) },
            {
              $inc: { CurrentBalance: element?.Points ? -element?.Points : 0 },
            }
          );
        }
      } else {
        element.Refundable = true;
        await SystemUsersDB.updateOne(
          { _id: new ObjectId(_id) },
          {
            $inc: { CurrentBalance: element?.Points ? -element?.Points : 0 },
          }
        );
      }
    }

    try {
      const InsertedSerial = await SerialsDB.insertOne(element);
      //Check if success and if not return error
      if (InsertedSerial.insertedId) InsertedSerialsCount++;
    } catch (error) {
      InsertedErrors++;
    }
  }

  res
    .status(200)
    .json({
      InsertedSerialsCount: InsertedSerialsCount,
      InsertedErrors: InsertedErrors,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Create-Series-Episodes-Mass", async (req, res) => {
  const { Token, Episodes } = req.body;

  if (!Episodes) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserUpload.length; index++) {
    let Priv = UserUpload[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { isAdmin, Privileges, Username } = AdminQuery ? AdminQuery : {};

  if (!isAdmin) return res.status(401).sendStatus(401)?.end?.();

  let InsertedEpisodesCount = 0;
  let InsertedErrors = 0;
  for (let index = 0; index < Episodes?.length; index++) {
    const element = Episodes[index];
    if (!element) {
      continue;
    }

    const EP = {
      ...element,
      CreatedBy: { Username, _id: _id },
      IsUpload: true,
      CreatedAt: new Date(),
    };
    try {
      const UploadedEpisodes = await EpisodesDB.insertOne(EP);
      InsertedEpisodesCount++;
    } catch (error) {
      InsertedErrors++;
    }
  }

  res
    .status(200)
    .json({
      InsertedEpisodesCount: InsertedEpisodesCount,
      InsertedErrors: InsertedErrors,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Create-Lives-Mass", async (req, res) => {
  const { Token, Data } = req.body;

  if (!Data) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserUpload.length; index++) {
    let Priv = UserUpload[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { isAdmin, Privileges, Username } = AdminQuery ? AdminQuery : {};

  let InsertedCount = 0;
  let InsertedErrors = 0;
  for (let index = 0; index < Data?.length; index++) {
    const element = Data[index];
    if (!element) {
      continue;
    }

    const Live = {
      ...element,
      CreatedBy: { Username, _id: _id },
      IsUpload: true,
      CreatedAt: new Date(),
      Status: true,
    };
    try {
      const UploadedEpisodes = await LivesDB.insertOne(Live);
      InsertedCount++;
    } catch (error) {
      InsertedErrors++;
    }
  }

  res
    .status(200)
    .json({
      InsertedCount: InsertedCount,
      InsertedErrors: InsertedErrors,
      Valid: true,
    })
    ?.end?.();
});

router.post("/Delete-Serial", async (req, res) => {
  const { Token, SerialID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //   const { _id } = Verify(Token);

  const GetSerialQuery = await SerialsDB.findOne({
    _id: new ObjectId(SerialID),
  });

  const {
    _id,
    Code,
    CreatedBy,
    Serial,
    Points: SerialPoints = 0,
    Refundable,
  } = GetSerialQuery ? GetSerialQuery : {};

  await SerialsDB.deleteOne({ _id: new ObjectId(SerialID) });

  if (Refundable && SerialPoints >= 1) {
    await SystemUsersDB.updateOne(
      { _id: new ObjectId(`${CreatedBy?._id}`) },
      { $inc: { CurrentBalance: SerialPoints, Refunded: SerialPoints } }
    );
  } else {
    console.log(`Not Refundable, ${Refundable}, Points: ${SerialPoints}`);
  }

  const GetCodeQuery = await CodesDB.findOne({
    Code: Code,
  });

  const { Period, Points } = GetCodeQuery ? GetCodeQuery : {};

  // if (SerialPoints >= 1) {
  //   await SystemUsersDB.updateOne(
  //     {
  //       _id: new ObjectId(`${CreatedBy?._id}`),
  //     },
  //     {
  //       $inc: {
  //         CurrentBalance: SerialPoints,
  //       },
  //     }
  //   );
  // }

  // if (Points >= 1) {
  //   await SystemUsersDB.updateOne(
  //     {
  //       _id: new ObjectId(`${CreatedBy?._id}`),
  //     },
  //     {
  //       $inc: {
  //         CurrentBalance: -Points,
  //       },
  //     }
  //   );
  // }

  //   const GetPeriodQuery = await PeriodsDB.findOne({
  //     Period: Number(Period),
  //   } );

  const PeriodToChange = Period;
  //PeriodToChange is a number of days
  const NewDateToExpire = new Date();
  NewDateToExpire.setDate(NewDateToExpire.getDate() + PeriodToChange);

  console.log(`Deleted Serial, ${Serial}`);

  const UpdateClientQuery = await ClientsDB.updateOne(
    {
      $or: [
        {
          SerialNumber: Serial,
        },
        {
          MacAddress: Serial,
        },
      ],
    },
    {
      $set: {
        Period: PeriodToChange,
        Points: Points,
        ExpireAt: NewDateToExpire,
        SubscriptionType: "Code",
      },
    }
  );

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-All-Serial", async (req, res) => {
  const { Token, Code: CodeQuery, DeleteAll, ReceiverType } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  //   const { _id } = Verify(Token);

  let GetSerialQuery = [];
  if (IsUserAdmin) {
    GetSerialQuery = await SerialsDB.find(
      DeleteAll === "Yes"
        ? {}
        : {
            Code: CodeQuery,
          }
    ).toArray();

    if (ReceiverType) {
      GetSerialQuery = await SerialsDB.find({
        ReceiverType: ReceiverType,
      }).toArray();
    }
  } else {
    GetSerialQuery = await SerialsDB.find({
      "CreatedBy._id": `${UserIDPriv}`,
    }).toArray();

    if (ReceiverType) {
      GetSerialQuery = await SerialsDB.find({
        "CreatedBy._id": `${UserIDPriv}`,
        ReceiverType: ReceiverType,
      }).toArray();
    }
  }

  for (let index = 0; index < GetSerialQuery?.length; index++) {
    const SerialElement = GetSerialQuery[index];
    const { _id, Code, CreatedBy, Serial, Points, Refundable } = SerialElement
      ? SerialElement
      : {};

    await SerialsDB.deleteOne({ _id: new ObjectId(`${_id}`) });

    if (Refundable && Points >= 1) {
      await SystemUsersDB.updateOne(
        { _id: new ObjectId(`${CreatedBy?._id}`) },
        { $inc: { CurrentBalance: Points, Refunded: Points } }
      );
    } else {
      console.log(`Not Refundable, ${Refundable}, Points: ${Points}`);
    }

    const GetCodeQuery = await CodesDB.findOne({
      Code: Code,
    });

    const { Period } = GetCodeQuery ? GetCodeQuery : {};
    const PeriodToChange = Period;

    const NewDateToExpire = new Date();
    NewDateToExpire.setDate(NewDateToExpire.getDate() + PeriodToChange);

    const UpdateClientQuery = await ClientsDB.updateMany(
      {
        $or: [{ SerialNumber: Serial }, { MacAddress: Serial }],
      },
      {
        $set: {
          Period: PeriodToChange,
          ExpireAt: NewDateToExpire,
          SubscriptionType: "Code",
        },
      }
    );
  }

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Create-Serial", async (req, res) => {
  const { Token, Value, Period, ReceiverType, Code } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const SettingsQuery = await SettingsDB.find({}).toArray();
  const { PointsDeductionType = false } = SettingsQuery[0]
    ? SettingsQuery[0]
    : {};

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = Verify(Token);

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const {
    isAdmin,
    Privileges,
    Username,
    Points: UserPoints,
  } = AdminQuery ? AdminQuery : {};

  // if (!isAdmin) return res.status(401).sendStatus(401)?.end?.();

  const CodeQuery = await CodesDB.findOne({ Code: Code });
  if (!CodeQuery) return res.status(404).sendStatus(404)?.end?.();

  const PeriodQuery = await PeriodsDB.findOne({ Period: Period });

  if (!PeriodQuery) return res.status(404).sendStatus(404)?.end?.();

  const { Points = 0 } = PeriodQuery ? PeriodQuery : {};

  if (UserPoints < Points && PointsDeductionType === false && !IsUserAdmin)
    return res
      .status(401)
      .json({ LackPoints: true, PointsNeeded: Points - UserPoints })
      ?.end?.();

  const NewSerial = {
    Serial: Value,
    Period: Period,
    Points: Points,
    ReceiverType: ReceiverType,
    Code: Code,
    CreatedAt: new Date(),
    CreatedBy: {
      _id: _id,
      Username: Username,
    },
  };

  const NewDateToExpire = new Date();
  NewDateToExpire.setDate(NewDateToExpire.getDate() + Period);

  const ClientsUpdate = await ClientsDB.updateMany(
    {
      $or: [{ SerialNumber: Value }, { MacAddress: Value }],
    },
    {
      $set: {
        Period: Period,
        Points: Points,
        ExpireAt: NewDateToExpire,
        Code: Code,
      },
    }
  );

  if (!IsUserAdmin) {
    if (PointsDeductionType) {
      NewSerial.Refundable = false;
      const IsClientQuery = await ClientsDB.count({
        $or: [{ SerialNumber: Value }, { MacAddress: Value }],
      });
      if (IsClientQuery >= 1) {
        await SystemUsersDB.updateOne(
          { _id: new ObjectId(_id) },
          {
            $inc: { CurrentBalance: -Points, Spent },
          }
        );
      }
    } else {
      NewSerial.Refundable = true;
      await SystemUsersDB.updateOne(
        { _id: new ObjectId(_id) },
        {
          $inc: { CurrentBalance: -Points },
        }
      );
    }
  }

  const InsertedSerial = await SerialsDB.insertOne(NewSerial);

  res
    .status(200)
    .json({ Valid: InsertedSerial.insertedId ? true : false })
    ?.end?.();
});

router.get("/ProxyImage", async (req, res) => {
  const { ImageURL = "" } = req.query;

  res.writeHead(200, { "Content-Type": "image/png" });

  if (!ImageURL || !ImageURL?.includes?.("http")) return res.send(ImageURL);

  request(ImageURL).pipe(res);
});

router.post("/Periods", async (req, res) => {
  const { Token } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Periods") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  let Periods = await PeriodsDB.find({}).toArray();

  res.status(200).json({ Periods: Periods, Valid: true })?.end?.();

  Periods = undefined;
});

router.post("/Points", async (req, res) => {
  const { Token } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = DecodedToken;
  let Admin = await DB.findOne({ _id: new ObjectId(_id) });

  const { CurrentBalance, StartedBalance, isAdmin, Username } = Admin;

  let Codes = await CodesDB.find({
    "CreatedBy.Username": `${Username}`,
  }).toArray();

  let Clients = await ClientDB.find({
    "CreatedBy.Username": `${Username}`,
    SubscriptionType: "Serial",
  }).toArray();

  let Serials = await SerialsDB.find({
    "CreatedBy.Username": `${Username}`,
    Refundable: true,
  }).toArray();

  let Spent = 0;
  for (let index = 0; index < Codes.length; index++) {
    const { Points = 0 } = Codes[index];
    Spent += Points;
  }

  for (let index = 0; index < Clients.length; index++) {
    const { Points = 0 } = Clients[index];
    Spent += Points;
  }

  for (let index = 0; index < Serials.length; index++) {
    const { Points = 0 } = Serials[index];
    Spent += Points;
  }

  res
    .status(200)
    .json({
      Balance: CurrentBalance,
      StartedBalance: StartedBalance,
      isAdmin: isAdmin,
      Username: Username,
      Valid: true,
      Spent: Spent,
    })
    ?.end?.();

  Admin = undefined;
  Codes = undefined;
  Clients = undefined;
  Serials = undefined;
});

router.post("/Privileges", async (req, res) => {
  const { Token } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = DecodedToken;
  let Admin = await DB.findOne({ _id: new ObjectId(_id) });

  const { Privileges, isAdmin } = Admin;

  res
    .status(200)
    .json({ Privileges: Privileges, isAdmin: isAdmin, Valid: true })
    ?.end?.();

  Admin = undefined;
});

router.post("/Serials-Count", async (req, res) => {
  const { Token, Skip, Limit } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Count = await SerialsDB.count(
    IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }
  );
  const Serials = await SerialsDB.find(
    IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv }
  )
    .skip(Skip)
    .limit(Number(Limit))
    .sort({ _id: -1 })
    .toArray();

  res
    .status(200)
    .json({ Count: Count, Serials: Serials, Valid: true })
    ?.end?.();
});

router.post("/Serials-Count-Search", async (req, res) => {
  let { Token, Skip, Limit, Query, ReceiverType } = req.body;

  console.log("Request 1", ReceiverType);

  const DecodedToken = Verify(Token);

  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  console.log("Request 2");
  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  console.log("Request 3");

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminObject = IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv };

  console.log(`Limits ${Number(Limit)}, Skip ${Number(Skip)}, Line ${3685}`);

  console.log(AdminObject);

  // console.log({
  //   ReceiverType: new RegExp(Query, "gim"),
  //   ...AdminObject,
  // });

  if (ReceiverType) {
    const Count = await SerialsDB.count({
      Serial: new RegExp(Query, "gim"),
      ReceiverType: ReceiverType ? ReceiverType : new RegExp(Query, "gim"),
      ...AdminObject,
    });

    const Serials = await SerialsDB.find({
      Serial: new RegExp(Query, "gim"),
      ReceiverType: ReceiverType ? ReceiverType : new RegExp(Query, "gim"),
      ...AdminObject,
    })
      .skip(Number(Skip))
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
    res
      .status(200)
      .json({ Count: Count, Serials: Serials, Valid: true })
      ?.end?.();
  } else {
    const Count = await SerialsDB.count({
      $or: [
        {
          Serial: new RegExp(Query, "gim"),
        },
        {
          Code: new RegExp(Query, "gim"),
        },
        {
          ReceiverType: ReceiverType ? ReceiverType : new RegExp(Query, "gim"),
        },
      ],
      ...AdminObject,
    });

    const Serials = await SerialsDB.find({
      $or: [
        {
          Serial: new RegExp(Query, "gim"),
        },
        {
          Code: new RegExp(Query, "gim"),
        },
        {
          ReceiverType: ReceiverType ? ReceiverType : new RegExp(Query, "gim"),
        },
      ],
      ...AdminObject,
    })
      .skip(Number(Skip))
      .limit(Number(Limit))
      .sort({ _id: -1 })
      .toArray();
    res
      .status(200)
      .json({ Count: Count, Serials: Serials, Valid: true })
      ?.end?.();
  }
});

router.post("/Get-Receiver-Types", async (req, res) => {
  let { Token } = req.body;

  const DecodedToken = Verify(Token);

  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminObject = IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv };

  // Get ReceiverType types, as an array of one each type of receiver type
  const ReceiverTypes = await SerialsDB.distinct("ReceiverType", {
    ...AdminObject,
  });
  res.status(200).json({ ReceiverTypes: ReceiverTypes, Valid: true })?.end?.();
});

router.post("/Get-Serials-By-Receiver-Type", async (req, res) => {
  let { Token, Skip, Limit, ReceiverType = "" } = req.body;

  const DecodedToken = Verify(Token);

  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserNavigation.length; index++) {
    let Priv = UserNavigation[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminObject = IsUserAdmin ? {} : { "CreatedBy._id": UserIDPriv };

  let Query = {};
  if (!ReceiverType || ReceiverType?.length <= 0) Query = { ...AdminObject };
  else Query = { ReceiverType, ...AdminObject };
  const Serials = await SerialsDB.find(Query)
    .limit(Number(Limit))
    .skip(Number(Skip))
    .sort({ _id: -1 })
    .toArray();

  const Count = await SerialsDB.count(Query);
  res
    .status(200)
    .json({ Serials: Serials, Count: Count, Valid: true })
    ?.end?.();
});

router.post("/Create-User", async (req, res) => {
  const { Token, Username, Password, Balance, Privileges = {} } = req.body;

  if (!Username || !Password || !Privileges)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Users") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { isAdmin, Username: UserCreated } = AdminQuery ? AdminQuery : {};

  const NewSeries = await SystemUsersDB.insertOne({
    Username,
    Password,
    CurrentBalance: Number(Balance),
    StartedBalance: Number(Balance),
    Privileges,
    CreatedBy: { UserCreated, _id: _id },
    CreatedAt: new Date(),
  });

  res
    .status(200)
    .json({
      Valid: true,
    })
    ?.end?.();
});

router.post("/Edit-User", async (req, res) => {
  const { Token, Username, Password, Balance, Privileges, UserID } = req.body;

  if (!Token || !Username || !Password || !Balance || !Privileges || !UserID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "User") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdatedSeries = await SystemUsersDB.updateOne(
    {
      _id: new ObjectId(UserID),
    },
    {
      $set: {
        Username,
        Password,
        CurrentBalance: Number(Balance),
        Privileges,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Delete-User", async (req, res) => {
  const { Token, UserID } = req.body;
  if (!UserID) return res.status(400).sendStatus(400);
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Users") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = Verify(Token);
  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const UserQuery = await SystemUsersDB.findOne({ _id: new ObjectId(UserID) });

  if (!UserQuery) return res.status(400).sendStatus(400);
  const { Username } = UserQuery ? UserQuery : {};

  await CodesDB.deleteMany({ "CreatedBy._id": `${UserID}` });
  await SerialsDB.deleteMany({ "CreatedBy._id": `${UserID}` });
  await SystemUsersDB.deleteOne({ _id: new ObjectId(UserID) });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Create-Series", async (req, res) => {
  const {
    Token,
    Name,
    Picture,
    SubCategory = {},
    Featured,
    Category,
  } = req.body;

  const { _id: CategoryID } = Category;

  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const NewSeries = await SeriesDB.insertOne({
    Name: Name,
    Picture: Picture,
    SubCategory: SubCategoryID,
    Featured: Featured,
    CreatedBy: { Username, _id: _id },
    CreatedAt: new Date(),
    Category: CategoryID,
  });

  res
    .status(200)
    .json({
      Valid: true,
    })
    ?.end?.();
});

router.post("/Create-Movies", async (req, res) => {
  const {
    Token,
    Name,
    Picture,
    SubCategory = {},
    Featured,
    Url,
    Category,
  } = req.body;

  const { _id: CategoryID } = Category;

  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Movies") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const NewMovie = await MoviesDB.insertOne({
    Name: Name,
    Picture: Picture,
    SubCategory: SubCategoryID,
    Category: `${CategoryID}`,
    Url: Url,
    Featured: Featured,
    CreatedBy: { Username, _id: _id },
    CreatedAt: new Date(),
  });

  res
    .status(200)
    .json({
      Valid: true,
    })
    ?.end?.();
});

router.post("/Edit-Movies", async (req, res) => {
  const {
    Token,
    Name,
    Picture,
    SubCategory,
    Featured,
    Url,
    MoviesID,
    CategoryID,
  } = req.body;
  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Movies") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdatedSeries = await MoviesDB.updateOne(
    {
      _id: new ObjectId(MoviesID),
    },
    {
      $set: {
        Name: Name,
        Picture: Picture,
        SubCategory: SubCategoryID,
        Category: `${CategoryID}`,
        Featured: Featured,
        Url: Url,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Create-Lives", async (req, res) => {
  const {
    Token,
    Name,
    Picture = "http://mybl.selfip.net/bigo-logos/bigo-main.jpg",
    SubCategory = {},
    Featured,
    Url,
    Category,
  } = req.body;

  const { _id: CategoryID } = Category;

  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const NewLive = await LivesDB.insertOne({
    Name: Name,
    Picture: Picture,
    SubCategory: SubCategoryID,
    Category: CategoryID,
    Url: Url,
    Featured: Featured,
    CreatedBy: { Username, _id: _id },
    CreatedAt: new Date(),
    Status: true,
  });

  res
    .status(200)
    .json({
      Valid: true,
    })
    ?.end?.();
});

router.post("/Edit-Lives", async (req, res) => {
  const {
    Token,
    Name,
    Picture = "http://mybl.selfip.net/bigo-logos/bigo-main.jpg",
    SubCategory,
    Featured,
    Url,
    LivesID,
    CategoryID,
  } = req.body;
  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = IsUserAdmin ? true : false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Lives") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdatedSeries = await LivesDB.updateOne(
    {
      _id: new ObjectId(LivesID),
    },
    {
      $set: {
        Name: Name,
        Picture: Picture,
        SubCategory: SubCategoryID,
        Category: `${CategoryID}`,
        Featured: Featured,
        Url: Url,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Create-Episode", async (req, res) => {
  const { Token, Name, Url, Series } = req.body;

  if (!Name || !Url || !Series) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;

  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const NewSeries = await EpisodesDB.insertOne({
    Name: Name,
    Url: Url,
    Series: Series,
    CreatedBy: { Username, _id: _id },
    CreatedAt: new Date(),
  });

  res
    .status(200)
    .json({
      Valid: true,
    })
    ?.end?.();
});

router.post("/Block-Country", async (req, res) => {
  const { Token, CountryID } = req.body;

  if (!CountryID) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Countries") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const Country = await CountriesDB.findOne({ _id: new ObjectId(CountryID) });
  if (!Country) return res.status(400).sendStatus(400);

  const { Blocked } = Country;

  const UpdatedSeries = await CountriesDB.updateOne(
    {
      _id: new ObjectId(CountryID),
    },
    {
      $set: {
        Blocked: !Blocked,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Edit-Episode", async (req, res) => {
  const { Token, Name, Url, Series, EpisodeID } = req.body;

  if (!Name || !Url || !Series || !EpisodeID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Series Episodes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdatedSeries = await EpisodesDB.updateOne(
    {
      _id: new ObjectId(EpisodeID),
    },
    {
      $set: {
        Name: Name,
        Url: Url,
        Series: Series,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Edit-SubCategory", async (req, res) => {
  const { Token, Name, Category = {}, Position = 0, SubCategoryID } = req.body;

  const { _id } = Category;
  if (!Name || !_id || !SubCategoryID) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const ToSwapPosition = await SubCategoriesDB.findOne({
    Category: `${_id}`,
    Position: Number(Position),
  });

  const CurrentPosition = await SubCategoriesDB.findOne({
    _id: new ObjectId(`${SubCategoryID}`),
  });

  let NewPosition = Number(Position);

  if (ToSwapPosition) {
    const { _id, Position: OldPosition } = ToSwapPosition;
    NewPosition = OldPosition;
    const { Position: LastPositionDB } = CurrentPosition;
    //Update position
    await SubCategoriesDB.updateOne(
      {
        _id: new ObjectId(`${_id}`),
      },
      {
        $set: {
          Position: LastPositionDB,
        },
      }
    );
  }

  const UpdatedSeries = await SubCategoriesDB.updateOne(
    {
      _id: new ObjectId(`${SubCategoryID}`),
    },
    {
      $set: {
        Name,
        Position: NewPosition,
        Category: `${_id}`,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Edit-Client", async (req, res) => {
  const { Token, Period, Blocked, ClientID } = req.body;

  if (!Token || !Period || Blocked === undefined || !ClientID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Activated Clients") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const CheckPeriod = await PeriodsDB.findOne({ Period: Period });
  if (!CheckPeriod) return res.status(400).sendStatus(400);

  const { Points = 0 } = CheckPeriod;
  const NewDateToExpire = new Date();
  NewDateToExpire.setDate(NewDateToExpire.getDate() + Number(Period));

  const ClientQuery = await ClientsDB.findOne({
    _id: new ObjectId(ClientID),
  });
  if (!ClientQuery) return res.status(404).sendStatus(404);

  const {
    Points: ClientPoints = 0,
    CreatedBy = {},
    Blocked: IsClientBlocked = false,
  } = ClientQuery;

  if (ClientPoints >= 1) {
    await SystemUsersDB.updateOne(
      { _id: new ObjectId(`${CreatedBy?._id}`) },
      {
        $inc: { CurrentBalance: ClientPoints },
      }
    );
  }

  if (Points >= 1) {
    await SystemUsersDB.updateOne(
      { _id: new ObjectId(`${CreatedBy?._id}`) },
      {
        $inc: { CurrentBalance: -Points },
      }
    );
  }

  const UpdatedSeries = await ClientDB.updateOne(
    {
      _id: new ObjectId(ClientID),
    },
    {
      $set: {
        Period: Period,
        Points: Points,
        Blocked: Blocked,
        ExpireAt: NewDateToExpire,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Edit-Series", async (req, res) => {
  const { Token, Name, Picture, SubCategory, Featured, SeriesID, CategoryID } =
    req.body;
  const { _id: SubCategoryID } = SubCategory;

  if (!Name || !Picture || !SubCategory || !SubCategoryID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Series") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdatedSeries = await SeriesDB.updateOne(
    {
      _id: new ObjectId(SeriesID),
    },
    {
      $set: {
        Name: Name,
        Picture: Picture,
        SubCategory: SubCategoryID,
        Category: `${CategoryID}`,
        Featured: Featured,
        UpdatedAt: new Date(),
      },
    }
  );

  console.warn(UpdatedSeries);

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
    })
    ?.end?.();
});

router.post("/Edit-Serial", async (req, res) => {
  const { Token, Value, Period, ReceiverType, Code, SerialID } = req.body;

  if (!Value || !Period || !Code || !SerialID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SettingsQuery = await SettingsDB.find({}).toArray();

  const { CodeLength = 13 } = SettingsQuery[0] ? SettingsQuery[0] : {};

  if (Code?.length != CodeLength) return res.status(400).sendStatus(400);

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const GetPeriod = await PeriodsDB.findOne({ Period: Period });
  const { Points } = GetPeriod ? GetPeriod : {};
  const PointsToDeduct = Points;

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const CodeBeforeEdit = await SerialsDB.findOne({
    _id: new ObjectId(SerialID),
  });
  const PointsAfterRefund = CodeBeforeEdit?.Points
    ? CurrentBalance + CodeBeforeEdit?.Points
    : CurrentBalance + 0;

  const { Serial } = CodeBeforeEdit;

  const { Period: PeriodToChange } = GetPeriod;

  const NewDateToExpire = new Date();
  //PeriodToChange is a number of days, Add them to NewDateToExpire
  NewDateToExpire.setDate(NewDateToExpire.getDate() + PeriodToChange);
  const ClientsUpdate = await ClientsDB.updateMany(
    {
      $or: [{ SerialNumber: Serial }, { MacAddress: Serial }],
    },
    {
      $set: {
        Period: PeriodToChange,
        ExpireAt: NewDateToExpire,
        Points: Points,
        Code: Code,
      },
    }
  );

  if (PointsAfterRefund < PointsToDeduct && !isAdmin)
    return res.status(400).sendStatus(400);

  const NewCurrentBalance = PointsAfterRefund - PointsToDeduct;

  await DB.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { CurrentBalance: NewCurrentBalance } }
  );

  const UpdatedCode = await SerialsDB.updateOne(
    {
      _id: new ObjectId(SerialID),
    },
    {
      $set: {
        Serial: Value,
        Code: Code,
        ReceiverType: ReceiverType,
        Period: Number(Period),
        Points: Points,
        CreatedBy: { Username, _id },
        CreatedAt: new Date(),
      },
    }
  );

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
      PointsDeducted: PointsToDeduct,
    })
    ?.end?.();
});

router.post("/Edit-Mass-Serials-By-ReceiverType", async (req, res) => {
  const { Token, Period, ReceiverType, ReceiverTypeToEdit, Code } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Serials & Mac Addresses") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SettingsQuery = await SettingsDB.find({}).toArray();

  const { CodeLength = 13 } = SettingsQuery[0] ? SettingsQuery[0] : {};

  if (Code && Code?.length != CodeLength)
    return res.status(400).sendStatus(400);

  const AdminQuery = await DB.findOne({ _id: new ObjectId(`${_id}`) });

  let GetPeriod = {};
  let { Points = 0 } = GetPeriod;
  let { Period: PeriodToChange } = GetPeriod;

  if (Period) {
    GetPeriod = await PeriodsDB.findOne({ Period: Period });
    Points = GetPeriod?.Points ? GetPeriod?.Points : 0;
    PeriodToChange = GetPeriod?.Period ? GetPeriod?.Period : 0;
  }
  const SerialsData = await SerialsDB.find({
    ReceiverType: ReceiverTypeToEdit,
  }).toArray();

  const PointsToDeduct = Points * SerialsData.length;

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const NewDateToExpire = new Date();
  //PeriodToChange is a number of days, Add them to NewDateToExpire
  NewDateToExpire.setDate(NewDateToExpire.getDate() + PeriodToChange);

  const DataToSetForSerial = {};
  if (Code) DataToSetForSerial.Code = Code;
  if (ReceiverType) DataToSetForSerial.ReceiverType = ReceiverType;
  if (PeriodToChange) DataToSetForSerial.Period = PeriodToChange;
  if (PeriodToChange) DataToSetForSerial.Points = Points;

  console.log(DataToSetForSerial.Points, Points);

  const UpdatedSerial = await SerialsDB.updateMany(
    {
      ReceiverType: ReceiverTypeToEdit,
    },
    {
      $set: {
        ...DataToSetForSerial,
      },
    }
  );

  const SerialsToUpdate = [];

  for (let index = 0; index < SerialsData.length; index++) {
    const { _id, Serial } = SerialsData[index];

    SerialsToUpdate.push({ SerialNumber: Serial });
    SerialsToUpdate.push({ MacAddress: Serial });
  }

  console.log(SerialsToUpdate);

  if (SerialsToUpdate.length <= 0)
    return res.status(404).json({
      Valid: false,
    });

  const serialBeforeEdit = SerialsData[0];

  const PointsAfterRefund = serialBeforeEdit?.Points
    ? CurrentBalance + serialBeforeEdit?.Points * SerialsData.length
    : CurrentBalance + 0;

  if (!isAdmin) return res.status(400).sendStatus(400);

  const NewCurrentBalance = PointsAfterRefund - PointsToDeduct;

  if (PointsToDeduct && PointsToDeduct > 0) {
    await DB.updateOne(
      { _id: new ObjectId(`${_id}`) },
      { $set: { CurrentBalance: NewCurrentBalance } }
    );
  }

  if (Code) serialBeforeEdit.Code = Code;
  if (PeriodToChange) serialBeforeEdit.Period = PeriodToChange;
  if (PeriodToChange) serialBeforeEdit.Points = Points;
  if (PeriodToChange) serialBeforeEdit.ExpireAt = NewDateToExpire;

  delete serialBeforeEdit._id;

  // console.log(serialBeforeEdit);
  const ClientsUpdate = await ClientsDB.updateMany(
    {
      $or: SerialsToUpdate,
    },
    {
      $set: {
        ...serialBeforeEdit,
      },
    }
  );

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
      PointsDeducted: PointsToDeduct,
    })
    ?.end?.();
});

router.post("/Create-Codes", async (req, res) => {
  const {
    Token,
    Value,
    Limit,
    Company,
    ClientType,
    isGenerate,
    Period,
    SubCategories = [],
  } = req.body;

  if (!Value || !Period || !Limit) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (isGenerate) {
    for (let index = 0; index < UserGenerate.length; index++) {
      let Priv = UserGenerate[index];
      if (Priv?.Name == "Codes") {
        const { permitted } = Priv;
        Pass = permitted || IsUserAdmin;
        break;
      } else {
        Pass = IsUserAdmin ? true : false;
      }
      Priv = undefined;
    }
  } else {
    for (let index = 0; index < UserManual.length; index++) {
      let Priv = UserManual[index];
      if (Priv?.Name == "Codes") {
        const { permitted } = Priv;
        Pass = permitted || IsUserAdmin;
        break;
      } else {
        Pass = IsUserAdmin ? true : false;
      }
      Priv = undefined;
    }
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SettingsQuery = await SettingsDB.find({}).toArray();

  const { CodeLength = 13 } = SettingsQuery[0] ? SettingsQuery[0] : {};

  if (Value?.length != CodeLength && !isGenerate)
    return res.status(400).sendStatus(400);

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const GetPeriod = await PeriodsDB.findOne({ Period: Period });
  const { Points } = GetPeriod ? GetPeriod : {};
  const PointsToDeduct = isGenerate ? Points * Value : Points;

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  if (CurrentBalance < PointsToDeduct && !isAdmin)
    return res.status(400).sendStatus(400);
  const NewCurrentBalance = CurrentBalance - PointsToDeduct;

  await DB.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { CurrentBalance: NewCurrentBalance } }
  );

  const GeneratedCodes = await GenerateOrGetCode(Value, isGenerate);

  const AllowedSubCategories = SubCategories.filter((SubCategory) => {
    return SubCategory?.permitted == true;
  });

  for (let index = 0; index < GeneratedCodes.length; index++) {
    const GeneratedCode = GeneratedCodes[index];
    const NewCode = await CodesDB.insertOne({
      Code: GeneratedCode,
      Company: Company,
      ClientType: ClientType,
      Period: Number(Period),
      Points: Points,
      isGenerate: isGenerate,
      CreatedBy: { Username, _id: _id },
      CreatedAt: new Date(),
      Limit: isGenerate ? 1 : Number(Limit),
    });

//     if (!isGenerate) {
      const NewCodeID = NewCode.insertedId;

      for (let indexj = 0; indexj < AllowedSubCategories.length; indexj++) {
        const element = AllowedSubCategories[indexj];
        const ID = element?._id;
        await SubCategoriesDB.updateOne(
          { _id: new ObjectId(`${ID}`) },
          { $push: { SubCategoriesAllowed: `${NewCodeID}` } }
        );
      }
    }
//   }

  res
    .status(200)
    .json({
      Valid: true,
      Generated: isGenerate ? GeneratedCodes.length : 1,
      PointsDeducted: isGenerate ? PointsToDeduct : Points,
    })
    ?.end?.();
});

const GenerateOrGetCode = async (Value, isGenerate) => {
  if (!isGenerate) return [Value];

  //Value is a number of codes to generate, Each code should be 13 numbers long
  const GeneratedCodes = [];
  for (let index = 0; index < Value; index++) {
    let Code = "";
    for (let index = 0; index < 13; index++) {
      Code += Math.floor(Math.random() * 10);
    }
    const CodeExists = await CodesDB.findOne({ Code: Code });
    if (CodeExists) {
      index--;
      continue;
    }
    GeneratedCodes.push(Code);
  }

  //Check if GeneratedCodes is an array
  return GeneratedCodes;
};

router.post("/Edit-Code", async (req, res) => {
  const {
    Token,
    Value,
    Limit,
    Company,
    ClientType,
    Period,
    CodeID,
    SubCategories = [],
  } = req.body;

  if (!Value || !Period || !Limit) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (Number(Limit) > 1) {
    Pass = IsUserAdmin ? true : false;

    for (let index = 0; index < UserManual.length; index++) {
      let Priv = UserManual[index];
      if (Priv?.Name == "Codes") {
        const { permitted } = Priv;
        Pass = permitted || IsUserAdmin;
        break;
      }
      Priv = undefined;
    }
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SettingsQuery = await SettingsDB.find({}).toArray();

  const { CodeLength = 13 } = SettingsQuery[0] ? SettingsQuery[0] : {};

//   console.log("Value?.length, CodeLength", Value?.length, CodeLength)
//   if (Value?.length != CodeLength) return res.status(400).sendStatus(400);

  const AdminQuery = await DB.findOne({ _id: new ObjectId(_id) });

  const GetPeriod = await PeriodsDB.findOne({ Period: Period });
  const { Points } = GetPeriod ? GetPeriod : {};
  const PointsToDeduct = Points;

  const { CurrentBalance, isAdmin, Privileges, Username } = AdminQuery
    ? AdminQuery
    : {};

  const CodeBeforeEdit = await CodesDB.findOne({ _id: new ObjectId(CodeID) });
  const PointsAfterRefund = CodeBeforeEdit?.Points
    ? CurrentBalance + CodeBeforeEdit?.Points
    : CurrentBalance + 0;

  const { Code: CodeToChange } = CodeBeforeEdit;
  const { Period: PeriodToChange } = GetPeriod;

  const NewDateToExpire = new Date();
  //PeriodToChange is a number of days, Add them to NewDateToExpire
  NewDateToExpire.setDate(NewDateToExpire.getDate() + PeriodToChange);
  const ClientsUpdate = await ClientsDB.updateMany(
    { Code: CodeToChange },
    {
      $set: {
        Period: PeriodToChange,
        ExpireAt: NewDateToExpire,
      },
    }
  );

  console.log("PointsAfterRefund, PointsToDeduct, isAdmin", PointsAfterRefund, PointsToDeduct, isAdmin)
  if (PointsAfterRefund < PointsToDeduct && !isAdmin)
    return res.status(400).sendStatus(400);
  const NewCurrentBalance = PointsAfterRefund - PointsToDeduct;

  await DB.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { CurrentBalance: NewCurrentBalance } }
  );

  const UpdatedCode = await CodesDB.updateOne(
    {
      _id: new ObjectId(CodeID),
    },
    {
      $set: {
        Code: Value,
        Company: Company,
        ClientType: ClientType,
        Period: Number(Period),
        Points: Points,
        CreatedAt: new Date(),
        Limit: Number(Limit),
      },
    }
  );

  const AllowedSubCategories = SubCategories.filter((SubCategory) => {
    return SubCategory?.permitted == true;
  });

  await SubCategoriesDB.updateMany(
    { SubCategoriesAllowed: `${CodeID}` },
    { $pull: { SubCategoriesAllowed: `${CodeID}` } }
  );

  for (let indexj = 0; indexj < AllowedSubCategories.length; indexj++) {
    const element = AllowedSubCategories[indexj];
    const ID = element?._id;
    console.log(`Category: ${ID}`);

    await SubCategoriesDB.updateOne(
      { _id: new ObjectId(`${ID}`) },
      { $push: { SubCategoriesAllowed: `${CodeID}` } }
    );
  }

  res
    .status(200)
    .json({
      Valid: true,
      Updated: true,
      PointsDeducted: PointsToDeduct,
    })
    ?.end?.();
});

router.post("/Delete-Code", async (req, res) => {
  const { Token, CodeID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const { _id } = Verify(Token);

  const CodeQuery = await CodesDB.findOne({ _id: new ObjectId(CodeID) });

  const { Points, Code, CreatedBy } = CodeQuery ? CodeQuery : {};
  //Delete all Serials with the Code
  //   await SerialsDB.deleteMany({ Code: Code });
  //Delete All Clients with the Code

  await ClientsDB.deleteMany({ Code: Code });

  const { _id: UserID } = CreatedBy ? CreatedBy : {};

  const AdminQuery = await DB.findOne({ _id: new ObjectId(`${UserID}`) });
  const { CurrentBalance } = AdminQuery ? AdminQuery : {};

  const NewCurrentBalance = Number(CurrentBalance) + Number(Points);

  await DB.updateOne(
    { _id: new ObjectId(`${UserID}`) },
    { $set: { CurrentBalance: Number(NewCurrentBalance) } }
  );

  await CodesDB.deleteOne({ _id: new ObjectId(`${CodeID}`) });

  //Sub Categories has SubCategoriesAllowed array that includes IDs of Codes, Remove the CodeID from the array
  await SubCategoriesDB.updateMany(
    { SubCategoriesAllowed: `${CodeID}` },
    { $pull: { SubCategoriesAllowed: `${CodeID}` } }
  );

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Delete-All-Code", async (req, res) => {
  const { Token, User, DeleteType } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  if (!DeleteType) return res.status(400).sendStatus(400);

  const { _id: UserIDPriv, _id } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const {
    Privileges: UserPrivileges,
    isAdmin: IsUserAdmin,
    Username: AdminUserName,
  } = UserQueryPriv;

  if (
    (DeleteType != "Generate" && !IsUserAdmin) ||
    (!IsUserAdmin && User.length >= 1)
  )
    return res.status(401).sendStatus(401)?.end?.();

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Codes") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const TypeToDelete = DeleteType === "Generate" ? true : false;
  let CodeQuery = [];
  if (User?.length >= 1) {
    CodeQuery = await CodesDB.find({
      "CreatedBy.Username": IsUserAdmin ? User : AdminUserName,
      isGenerate: TypeToDelete,
    }).toArray();
  } else {
    if (TypeToDelete) {
      CodeQuery = await CodesDB.find(
        IsUserAdmin && User?.length >= 1
          ? { "CreatedBy.Username": User, isGenerate: true }
          : IsUserAdmin
          ? { isGenerate: true }
          : { "CreatedBy.Username": AdminUserName, isGenerate: true }
      ).toArray();
    } else {
      CodeQuery = await CodesDB.find(
        IsUserAdmin && User?.length >= 1
          ? {
              "CreatedBy.Username": IsUserAdmin ? User : AdminUserName,
              isGenerate: false,
            }
          : IsUserAdmin
          ? {}
          : { "CreatedBy.Username": AdminUserName, isGenerate: false }
      ).toArray();
    }
  }

  for (let index = 0; index < CodeQuery?.length; index++) {
    const CodeElement = CodeQuery[index];
    const { Points, Code, _id, CreatedBy } = CodeElement ? CodeElement : {};
    await ClientsDB.deleteMany({ Code: Code });

    await CodesDB.deleteOne({ _id: new ObjectId(`${_id}`) });

    const { Username } = CreatedBy;
    const AdminQuery = await DB.findOne({ Username: Username });

    const { CurrentBalance } = AdminQuery ? AdminQuery : {};

    const NewCurrentBalance = CurrentBalance + Points;

    if (!isNaN(NewCurrentBalance)) {
      await DB.updateOne(
        { Username: Username },
        { $set: { CurrentBalance: Number(NewCurrentBalance) } }
      );
    }
  }

  res.status(200).json({ Valid: true })?.end?.();
});

//Generate Random string
const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.post("/Create-Period", async (req, res) => {
  const { Token, Period, Points } = req.body;
  if (!Period || Points === undefined) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Periods") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const CreatedPeriod = await PeriodsDB.insertOne({
    Period: Number(Period),
    Points: Number(Points),
    CreatedAt: new Date(),
  });

  res.status(200).json({ Valid: true, Created: true })?.end?.();
});

router.post("/Delete-Period", async (req, res) => {
  const { Token, ID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Periods") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  if (!Verify(Token)) return res.status(401).sendStatus(401)?.end?.();

  await PeriodsDB.deleteOne({ _id: new ObjectId(ID) });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/Edit-Period", async (req, res) => {
  const { Token, Period, Points, ID } = req.body;
  if (!Period || Points === undefined || !ID)
    return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Periods") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdateObject = {
    Period: Number(Period),
    Points: Number(Points),
    UpdatedAt: new Date(),
  };

  const EditedPeriod = await PeriodsDB.updateOne(
    {
      _id: new ObjectId(ID),
    },
    {
      $set: UpdateObject,
    }
  );

  res.status(200).json({ Valid: true, Updated: true })?.end?.();
});

router.post("/Create-Category", async (req, res) => {
  const { Token, Name, Type, Logo } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const CreatedCategory = await CategoriesDB.insertOne({
    Name,
    Type,
    CreatedAt: new Date(),
  });

  const Picture = await saveImage(Logo, CreatedCategory?.insertedId);
  const PictureUrl = `${process.env.HOST}/Images/${Picture}`;

  console.warn(`Updating category: ${CreatedCategory?.insertedId}`);
  await CategoriesDB.updateOne(
    {
      _id: new ObjectId(`${CreatedCategory?.insertedId}`),
    },
    {
      $set: { Logo: PictureUrl },
    }
  );

  res.status(200).json({ Valid: true, Created: true, PictureUrl })?.end?.();
});

router.post("/Create-SubCategory", async (req, res) => {
  const { Token, Name, Position = 0, Category = {} } = req.body;
  const { _id } = Category;
  if (!_id || !Name) return res.status(400).sendStatus(400);

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserCreate.length; index++) {
    let Priv = UserCreate[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const ToSwapPosition = await SubCategoriesDB.findOne({
    Category: `${_id}`,
    Position: Number(Position),
  });

  const LastPosition = await SubCategoriesDB.find({
    Category: `${_id}`,
  })
    .sort({ Position: -1 })
    .limit(0)
    .toArray();

  if (ToSwapPosition) {
    const { _id } = ToSwapPosition;
    const { Position: LastPositionDB } = LastPosition[0];
    //Update position
    await SubCategoriesDB.updateOne(
      {
        _id: new ObjectId(`${_id}`),
      },
      {
        $set: {
          Position: LastPositionDB + 1,
        },
      }
    );
  }

  const CreatedCategory = await SubCategoriesDB.insertOne({
    Name,
    Position: Number(Position),
    Category: `${_id}`,
    CreatedAt: new Date(),
  });

  res.status(200).json({ Valid: true, Created: true })?.end?.();
});

router.post("/Edit-Category", async (req, res) => {
  const { Token, Name, Type, Logo, CategoryID } = req.body;

  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserEdit.length; index++) {
    let Priv = UserEdit[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const UpdateObject = { Name, Type, UpdatedAt: new Date() };
  if (Logo?.length > 0) {
    const RemoveImage = await ImagesDB.deleteOne({
      Category: `${CategoryID}`,
    });

    const Picture = await saveImage(Logo, new ObjectId(CategoryID));
    UpdateObject.Logo = `${process.env.HOST}/Images/${Picture}`;

    const EditedCategory = await CategoriesDB.updateOne(
      {
        _id: new ObjectId(CategoryID),
      },
      {
        $set: UpdateObject,
      }
    );
  } else {
    const EditedCategory = await CategoriesDB.updateOne(
      {
        _id: new ObjectId(CategoryID),
      },
      {
        $set: UpdateObject,
      }
    );
  }

  res.status(200).json({ Valid: true, Updated: true })?.end?.();
});

const saveImage = async (baseImage, CategoryID) => {
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  const filename = `${randomString(25)}.${ext}`;

  const addImage = await ImagesDB.insertOne({
    Image: baseImage,
    filename: filename,
    ext: ext,
    Category: `${CategoryID}`,
  });

  console.warn(addImage);

  return filename;
};

router.post("/Delete-Category", async (req, res) => {
  const { Token, CategoryID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SubCategoryQuery = await SubCategoriesDB.findOne({
    Category: CategoryID,
  });

  const SubCategory = SubCategoryQuery ? SubCategoryQuery : {};
  //Check if SubCategory json object is empty and there is no keys
  if (Object.keys(SubCategory).length !== 0)
    return res.status(403).sendStatus(403);

  await CategoriesDB.deleteOne({ _id: new ObjectId(CategoryID) });
  await ImagesDB.deleteOne({ Category: `${CategoryID}` });

  res.status(200).json({ Valid: true })?.end?.();
});

router.post("/delete-SubCategory", async (req, res) => {
  const { Token, SubCategoryID } = req.body;
  const DecodedToken = Verify(Token);
  if (!DecodedToken) return res.status(401).sendStatus(401)?.end?.();

  const { _id: UserIDPriv } = DecodedToken ? DecodedToken : {};

  const UserQueryPriv = await SystemUsersDB.findOne({
    _id: UserIDPriv ? new ObjectId(UserIDPriv) : UserIDPriv,
  });

  const { Privileges: UserPrivileges, isAdmin: IsUserAdmin } = UserQueryPriv;

  const {
    Navigation: UserNavigation,
    Delete: UserDelete,
    Edit: UserEdit,
    Upload: UserUpload,
    Generate: UserGenerate,
    Manual: UserManual,
    Create: UserCreate,
  } = UserPrivileges;

  let Pass = false;
  for (let index = 0; index < UserDelete.length; index++) {
    let Priv = UserDelete[index];
    if (Priv?.Name == "Sub Categories") {
      const { permitted } = Priv;
      Pass = permitted || IsUserAdmin;
      break;
    }
    Priv = undefined;
  }

  if (!Pass && !IsUserAdmin) return res.status(401).sendStatus(401)?.end?.();

  const SubCategoryQuery = await SubCategoriesDB.deleteOne({
    _id: new ObjectId(SubCategoryID),
  });

  await MoviesDB.deleteMany({ SubCategory: `${SubCategoryID}` });

  const SeriesEpisodes = await SeriesDB.find({
    SubCategory: `${SubCategoryID}`,
  }).toArray();

  for (let index = 0; index < SeriesEpisodes?.length; index++) {
    const element = SeriesEpisodes[index];
    await EpisodesDB.deleteOne({ Series: `${element?._id}` });
  }

  await SeriesDB.deleteMany({ SubCategory: `${SubCategoryID}` });

  await LivesDB.deleteMany({ SubCategory: `${SubCategoryID}` });

  res.status(200).json({ Valid: true })?.end?.();
});

//JWT Signing, And Verification
import jwt from "jsonwebtoken";
import request from "request";
const Secret = process.env.AdminJWT_SECRET;
const Sign = (Data) => {
  return jwt.sign(Data, Secret, { expiresIn: "2h" });
};

const Verify = (Token) => {
  try {
    return jwt.verify(Token, Secret);
  } catch (error) {
    return undefined;
  }
};

export default router;
