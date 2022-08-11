const Countries = [];
const AllCountries = [
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6527",
    },
    Name: "Afghanistan",
    Blocked: false,
    Clients: 0,
    Code: "AF",
    UpdatedAt: {
      $date: "2022-04-23T00:44:42.995Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6528",
    },
    Name: "Åland Islands",
    Blocked: false,
    Clients: 0,
    Code: "AX",
    UpdatedAt: {
      $date: "2022-04-17T23:57:57.486Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6529",
    },
    Name: "Albania",
    Blocked: false,
    Clients: 0,
    Code: "AL",
    UpdatedAt: {
      $date: "2022-04-17T23:57:56.880Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652a",
    },
    Name: "Algeria",
    Blocked: false,
    Clients: 0,
    Code: "DZ",
    UpdatedAt: {
      $date: "2022-04-17T23:57:57.371Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652b",
    },
    Name: "American Samoa",
    Blocked: false,
    Clients: 0,
    Code: "AS",
    UpdatedAt: {
      $date: "2022-04-17T23:57:57.803Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652c",
    },
    Name: "AndorrA",
    Blocked: false,
    Clients: 0,
    Code: "AD",
    UpdatedAt: {
      $date: "2022-04-17T23:57:58.278Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652d",
    },
    Name: "Angola",
    Blocked: false,
    Clients: 0,
    Code: "AO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652e",
    },
    Name: "Anguilla",
    Blocked: false,
    Clients: 0,
    Code: "AI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf652f",
    },
    Name: "Antarctica",
    Blocked: false,
    Clients: 0,
    Code: "AQ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6530",
    },
    Name: "Antigua and Barbuda",
    Blocked: false,
    Clients: 0,
    Code: "AG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6531",
    },
    Name: "Argentina",
    Blocked: false,
    Clients: 0,
    Code: "AR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6532",
    },
    Name: "Armenia",
    Blocked: false,
    Clients: 0,
    Code: "AM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6533",
    },
    Name: "Aruba",
    Blocked: false,
    Clients: 0,
    Code: "AW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6534",
    },
    Name: "Australia",
    Blocked: false,
    Clients: 0,
    Code: "AU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6535",
    },
    Name: "Austria",
    Blocked: false,
    Clients: 0,
    Code: "AT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6536",
    },
    Name: "Azerbaijan",
    Blocked: false,
    Clients: 0,
    Code: "AZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6537",
    },
    Name: "Bahamas",
    Blocked: false,
    Clients: 0,
    Code: "BS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6538",
    },
    Name: "Bahrain",
    Blocked: false,
    Clients: 0,
    Code: "BH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6539",
    },
    Name: "Bangladesh",
    Blocked: false,
    Clients: 0,
    Code: "BD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653a",
    },
    Name: "Barbados",
    Blocked: false,
    Clients: 0,
    Code: "BB",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653b",
    },
    Name: "Belarus",
    Blocked: false,
    Clients: 0,
    Code: "BY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653c",
    },
    Name: "Belgium",
    Blocked: false,
    Clients: 0,
    Code: "BE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653d",
    },
    Name: "Belize",
    Blocked: false,
    Clients: 0,
    Code: "BZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653e",
    },
    Name: "Benin",
    Blocked: false,
    Clients: 0,
    Code: "BJ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf653f",
    },
    Name: "Bermuda",
    Blocked: false,
    Clients: 0,
    Code: "BM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6540",
    },
    Name: "Bhutan",
    Blocked: false,
    Clients: 0,
    Code: "BT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6541",
    },
    Name: "Bolivia",
    Blocked: false,
    Clients: 0,
    Code: "BO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6542",
    },
    Name: "Bosnia and Herzegovina",
    Blocked: false,
    Clients: 0,
    Code: "BA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6543",
    },
    Name: "Botswana",
    Blocked: false,
    Clients: 0,
    Code: "BW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6544",
    },
    Name: "Bouvet Island",
    Blocked: false,
    Clients: 0,
    Code: "BV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6545",
    },
    Name: "Brazil",
    Blocked: false,
    Clients: 0,
    Code: "BR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6546",
    },
    Name: "British Indian Ocean Territory",
    Blocked: false,
    Clients: 0,
    Code: "IO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6547",
    },
    Name: "Brunei Darussalam",
    Blocked: false,
    Clients: 0,
    Code: "BN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6548",
    },
    Name: "Bulgaria",
    Blocked: false,
    Clients: 0,
    Code: "BG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6549",
    },
    Name: "Burkina Faso",
    Blocked: false,
    Clients: 0,
    Code: "BF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654a",
    },
    Name: "Burundi",
    Blocked: false,
    Clients: 0,
    Code: "BI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654b",
    },
    Name: "Cambodia",
    Blocked: false,
    Clients: 0,
    Code: "KH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654c",
    },
    Name: "Cameroon",
    Blocked: false,
    Clients: 0,
    Code: "CM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654d",
    },
    Name: "Canada",
    Blocked: false,
    Clients: 0,
    Code: "CA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654e",
    },
    Name: "Cape Verde",
    Blocked: false,
    Clients: 0,
    Code: "CV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf654f",
    },
    Name: "Cayman Islands",
    Blocked: false,
    Clients: 0,
    Code: "KY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6550",
    },
    Name: "Central African Republic",
    Blocked: false,
    Clients: 0,
    Code: "CF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6551",
    },
    Name: "Chad",
    Blocked: false,
    Clients: 0,
    Code: "TD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6552",
    },
    Name: "Chile",
    Blocked: false,
    Clients: 0,
    Code: "CL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6553",
    },
    Name: "China",
    Blocked: false,
    Clients: 0,
    Code: "CN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6554",
    },
    Name: "Christmas Island",
    Blocked: false,
    Clients: 0,
    Code: "CX",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6555",
    },
    Name: "Cocos (Keeling) Islands",
    Blocked: false,
    Clients: 0,
    Code: "CC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6556",
    },
    Name: "Colombia",
    Blocked: false,
    Clients: 0,
    Code: "CO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6557",
    },
    Name: "Comoros",
    Blocked: false,
    Clients: 0,
    Code: "KM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6558",
    },
    Name: "Congo",
    Blocked: false,
    Clients: 0,
    Code: "CG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6559",
    },
    Name: "Congo, The Democratic Republic of the",
    Blocked: false,
    Clients: 0,
    Code: "CD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655a",
    },
    Name: "Cook Islands",
    Blocked: false,
    Clients: 0,
    Code: "CK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655b",
    },
    Name: "Costa Rica",
    Blocked: false,
    Clients: 0,
    Code: "CR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655c",
    },
    Name: "Cote D'Ivoire",
    Blocked: false,
    Clients: 0,
    Code: "CI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655d",
    },
    Name: "Croatia",
    Blocked: false,
    Clients: 0,
    Code: "HR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655e",
    },
    Name: "Cuba",
    Blocked: false,
    Clients: 0,
    Code: "CU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf655f",
    },
    Name: "Cyprus",
    Blocked: false,
    Clients: 0,
    Code: "CY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6560",
    },
    Name: "Czech Republic",
    Blocked: false,
    Clients: 0,
    Code: "CZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6561",
    },
    Name: "Denmark",
    Blocked: false,
    Clients: 0,
    Code: "DK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6562",
    },
    Name: "Djibouti",
    Blocked: false,
    Clients: 0,
    Code: "DJ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6563",
    },
    Name: "Dominica",
    Blocked: false,
    Clients: 0,
    Code: "DM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6564",
    },
    Name: "Dominican Republic",
    Blocked: false,
    Clients: 0,
    Code: "DO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6565",
    },
    Name: "Ecuador",
    Blocked: false,
    Clients: 0,
    Code: "EC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6566",
    },
    Name: "Egypt",
    Blocked: false,
    Clients: 0,
    Code: "EG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6567",
    },
    Name: "El Salvador",
    Blocked: false,
    Clients: 0,
    Code: "SV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6568",
    },
    Name: "Equatorial Guinea",
    Blocked: false,
    Clients: 0,
    Code: "GQ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6569",
    },
    Name: "Eritrea",
    Blocked: false,
    Clients: 0,
    Code: "ER",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656a",
    },
    Name: "Estonia",
    Blocked: false,
    Clients: 0,
    Code: "EE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656b",
    },
    Name: "Ethiopia",
    Blocked: false,
    Clients: 0,
    Code: "ET",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656c",
    },
    Name: "Falkland Islands (Malvinas)",
    Blocked: false,
    Clients: 0,
    Code: "FK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656d",
    },
    Name: "Faroe Islands",
    Blocked: false,
    Clients: 0,
    Code: "FO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656e",
    },
    Name: "Fiji",
    Blocked: false,
    Clients: 0,
    Code: "FJ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf656f",
    },
    Name: "Finland",
    Blocked: false,
    Clients: 0,
    Code: "FI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6570",
    },
    Name: "France",
    Blocked: false,
    Clients: 0,
    Code: "FR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6571",
    },
    Name: "French Guiana",
    Blocked: false,
    Clients: 0,
    Code: "GF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6572",
    },
    Name: "French Polynesia",
    Blocked: false,
    Clients: 0,
    Code: "PF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6573",
    },
    Name: "French Southern Territories",
    Blocked: false,
    Clients: 0,
    Code: "TF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6574",
    },
    Name: "Gabon",
    Blocked: false,
    Clients: 0,
    Code: "GA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6575",
    },
    Name: "Gambia",
    Blocked: false,
    Clients: 0,
    Code: "GM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6576",
    },
    Name: "Georgia",
    Blocked: false,
    Clients: 0,
    Code: "GE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6577",
    },
    Name: "Germany",
    Blocked: false,
    Clients: 0,
    Code: "DE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6578",
    },
    Name: "Ghana",
    Blocked: false,
    Clients: 0,
    Code: "GH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6579",
    },
    Name: "Gibraltar",
    Blocked: false,
    Clients: 0,
    Code: "GI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657a",
    },
    Name: "Greece",
    Blocked: false,
    Clients: 0,
    Code: "GR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657b",
    },
    Name: "Greenland",
    Blocked: false,
    Clients: 0,
    Code: "GL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657c",
    },
    Name: "Grenada",
    Blocked: false,
    Clients: 0,
    Code: "GD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657d",
    },
    Name: "Guadeloupe",
    Blocked: false,
    Clients: 0,
    Code: "GP",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657e",
    },
    Name: "Guam",
    Blocked: false,
    Clients: 0,
    Code: "GU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf657f",
    },
    Name: "Guatemala",
    Blocked: false,
    Clients: 0,
    Code: "GT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6580",
    },
    Name: "Guernsey",
    Blocked: false,
    Clients: 0,
    Code: "GG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6581",
    },
    Name: "Guinea",
    Blocked: false,
    Clients: 0,
    Code: "GN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6582",
    },
    Name: "Guinea-Bissau",
    Blocked: false,
    Clients: 0,
    Code: "GW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6583",
    },
    Name: "Guyana",
    Blocked: false,
    Clients: 0,
    Code: "GY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6584",
    },
    Name: "Haiti",
    Blocked: false,
    Clients: 0,
    Code: "HT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6585",
    },
    Name: "Heard Island and Mcdonald Islands",
    Blocked: false,
    Clients: 0,
    Code: "HM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6586",
    },
    Name: "Holy See (Vatican City State)",
    Blocked: false,
    Clients: 0,
    Code: "VA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6587",
    },
    Name: "Honduras",
    Blocked: false,
    Clients: 0,
    Code: "HN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6588",
    },
    Name: "Hong Kong",
    Blocked: false,
    Clients: 0,
    Code: "HK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6589",
    },
    Name: "Hungary",
    Blocked: false,
    Clients: 0,
    Code: "HU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658a",
    },
    Name: "Iceland",
    Blocked: false,
    Clients: 0,
    Code: "IS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658b",
    },
    Name: "India",
    Blocked: false,
    Clients: 0,
    Code: "IN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658c",
    },
    Name: "Indonesia",
    Blocked: false,
    Clients: 0,
    Code: "ID",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658d",
    },
    Name: "Iran, Islamic Republic Of",
    Blocked: false,
    Clients: 0,
    Code: "IR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658e",
    },
    Name: "Iraq",
    Blocked: false,
    Clients: 0,
    Code: "IQ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf658f",
    },
    Name: "Ireland",
    Blocked: false,
    Clients: 0,
    Code: "IE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6590",
    },
    Name: "Isle of Man",
    Blocked: false,
    Clients: 0,
    Code: "IM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6591",
    },
    Name: "Israel",
    Blocked: false,
    Clients: 0,
    Code: "IL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6592",
    },
    Name: "Italy",
    Blocked: false,
    Clients: 0,
    Code: "IT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6593",
    },
    Name: "Jamaica",
    Blocked: false,
    Clients: 0,
    Code: "JM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6594",
    },
    Name: "Japan",
    Blocked: false,
    Clients: 0,
    Code: "JP",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6595",
    },
    Name: "Jersey",
    Blocked: false,
    Clients: 0,
    Code: "JE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6596",
    },
    Name: "Jordan",
    Blocked: false,
    Clients: 0,
    Code: "JO",
    UpdatedAt: {
      $date: "2022-04-20T18:51:43.391Z",
    },
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6597",
    },
    Name: "Kazakhstan",
    Blocked: false,
    Clients: 0,
    Code: "KZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6598",
    },
    Name: "Kenya",
    Blocked: false,
    Clients: 0,
    Code: "KE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6599",
    },
    Name: "Kiribati",
    Blocked: false,
    Clients: 0,
    Code: "KI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659a",
    },
    Name: "Korea, Democratic People'S Republic of",
    Blocked: false,
    Clients: 0,
    Code: "KP",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659b",
    },
    Name: "Korea, Republic of",
    Blocked: false,
    Clients: 0,
    Code: "KR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659c",
    },
    Name: "Kuwait",
    Blocked: false,
    Clients: 0,
    Code: "KW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659d",
    },
    Name: "Kyrgyzstan",
    Blocked: false,
    Clients: 0,
    Code: "KG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659e",
    },
    Name: "Lao People'S Democratic Republic",
    Blocked: false,
    Clients: 0,
    Code: "LA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf659f",
    },
    Name: "Latvia",
    Blocked: false,
    Clients: 0,
    Code: "LV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a0",
    },
    Name: "Lebanon",
    Blocked: false,
    Clients: 0,
    Code: "LB",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a1",
    },
    Name: "Lesotho",
    Blocked: false,
    Clients: 0,
    Code: "LS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a2",
    },
    Name: "Liberia",
    Blocked: false,
    Clients: 0,
    Code: "LR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a3",
    },
    Name: "Libyan Arab Jamahiriya",
    Blocked: false,
    Clients: 0,
    Code: "LY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a4",
    },
    Name: "Liechtenstein",
    Blocked: false,
    Clients: 0,
    Code: "LI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a5",
    },
    Name: "Lithuania",
    Blocked: false,
    Clients: 0,
    Code: "LT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a6",
    },
    Name: "Luxembourg",
    Blocked: false,
    Clients: 0,
    Code: "LU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a7",
    },
    Name: "Macao",
    Blocked: false,
    Clients: 0,
    Code: "MO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a8",
    },
    Name: "Macedonia, The Former Yugoslav Republic of",
    Blocked: false,
    Clients: 0,
    Code: "MK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65a9",
    },
    Name: "Madagascar",
    Blocked: false,
    Clients: 0,
    Code: "MG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65aa",
    },
    Name: "Malawi",
    Blocked: false,
    Clients: 0,
    Code: "MW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ab",
    },
    Name: "Malaysia",
    Blocked: false,
    Clients: 0,
    Code: "MY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ac",
    },
    Name: "Maldives",
    Blocked: false,
    Clients: 0,
    Code: "MV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ad",
    },
    Name: "Mali",
    Blocked: false,
    Clients: 0,
    Code: "ML",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ae",
    },
    Name: "Malta",
    Blocked: false,
    Clients: 0,
    Code: "MT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65af",
    },
    Name: "Marshall Islands",
    Blocked: false,
    Clients: 0,
    Code: "MH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b0",
    },
    Name: "Martinique",
    Blocked: false,
    Clients: 0,
    Code: "MQ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b1",
    },
    Name: "Mauritania",
    Blocked: false,
    Clients: 0,
    Code: "MR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b2",
    },
    Name: "Mauritius",
    Blocked: false,
    Clients: 0,
    Code: "MU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b3",
    },
    Name: "Mayotte",
    Blocked: false,
    Clients: 0,
    Code: "YT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b4",
    },
    Name: "Mexico",
    Blocked: false,
    Clients: 0,
    Code: "MX",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b5",
    },
    Name: "Micronesia, Federated States of",
    Blocked: false,
    Clients: 0,
    Code: "FM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b6",
    },
    Name: "Moldova, Republic of",
    Blocked: false,
    Clients: 0,
    Code: "MD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b7",
    },
    Name: "Monaco",
    Blocked: false,
    Clients: 0,
    Code: "MC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b8",
    },
    Name: "Mongolia",
    Blocked: false,
    Clients: 0,
    Code: "MN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65b9",
    },
    Name: "Montserrat",
    Blocked: false,
    Clients: 0,
    Code: "MS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ba",
    },
    Name: "Morocco",
    Blocked: false,
    Clients: 0,
    Code: "MA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65bb",
    },
    Name: "Mozambique",
    Blocked: false,
    Clients: 0,
    Code: "MZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65bc",
    },
    Name: "Myanmar",
    Blocked: false,
    Clients: 0,
    Code: "MM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65bd",
    },
    Name: "Namibia",
    Blocked: false,
    Clients: 0,
    Code: "NA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65be",
    },
    Name: "Nauru",
    Blocked: false,
    Clients: 0,
    Code: "NR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65bf",
    },
    Name: "Nepal",
    Blocked: false,
    Clients: 0,
    Code: "NP",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c0",
    },
    Name: "Netherlands",
    Blocked: false,
    Clients: 0,
    Code: "NL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c1",
    },
    Name: "Netherlands Antilles",
    Blocked: false,
    Clients: 0,
    Code: "AN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c2",
    },
    Name: "New Caledonia",
    Blocked: false,
    Clients: 0,
    Code: "NC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c3",
    },
    Name: "New Zealand",
    Blocked: false,
    Clients: 0,
    Code: "NZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c4",
    },
    Name: "Nicaragua",
    Blocked: false,
    Clients: 0,
    Code: "NI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c5",
    },
    Name: "Niger",
    Blocked: false,
    Clients: 0,
    Code: "NE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c6",
    },
    Name: "Nigeria",
    Blocked: false,
    Clients: 0,
    Code: "NG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c7",
    },
    Name: "Niue",
    Blocked: false,
    Clients: 0,
    Code: "NU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c8",
    },
    Name: "Norfolk Island",
    Blocked: false,
    Clients: 0,
    Code: "NF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65c9",
    },
    Name: "Northern Mariana Islands",
    Blocked: false,
    Clients: 0,
    Code: "MP",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ca",
    },
    Name: "Norway",
    Blocked: false,
    Clients: 0,
    Code: "NO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65cb",
    },
    Name: "Oman",
    Blocked: false,
    Clients: 0,
    Code: "OM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65cc",
    },
    Name: "Pakistan",
    Blocked: false,
    Clients: 0,
    Code: "PK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65cd",
    },
    Name: "Palau",
    Blocked: false,
    Clients: 0,
    Code: "PW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ce",
    },
    Name: "Palestinian Territory, Occupied",
    Blocked: false,
    Clients: 0,
    Code: "PS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65cf",
    },
    Name: "Panama",
    Blocked: false,
    Clients: 0,
    Code: "PA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d0",
    },
    Name: "Papua New Guinea",
    Blocked: false,
    Clients: 0,
    Code: "PG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d1",
    },
    Name: "Paraguay",
    Blocked: false,
    Clients: 0,
    Code: "PY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d2",
    },
    Name: "Peru",
    Blocked: false,
    Clients: 0,
    Code: "PE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d3",
    },
    Name: "Philippines",
    Blocked: false,
    Clients: 0,
    Code: "PH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d4",
    },
    Name: "Pitcairn",
    Blocked: false,
    Clients: 0,
    Code: "PN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d5",
    },
    Name: "Poland",
    Blocked: false,
    Clients: 0,
    Code: "PL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d6",
    },
    Name: "Portugal",
    Blocked: false,
    Clients: 0,
    Code: "PT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d7",
    },
    Name: "Puerto Rico",
    Blocked: false,
    Clients: 0,
    Code: "PR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d8",
    },
    Name: "Qatar",
    Blocked: false,
    Clients: 0,
    Code: "QA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65d9",
    },
    Name: "Reunion",
    Blocked: false,
    Clients: 0,
    Code: "RE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65da",
    },
    Name: "Romania",
    Blocked: false,
    Clients: 0,
    Code: "RO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65db",
    },
    Name: "Russian Federation",
    Blocked: false,
    Clients: 0,
    Code: "RU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65dc",
    },
    Name: "RWANDA",
    Blocked: false,
    Clients: 0,
    Code: "RW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65dd",
    },
    Name: "Saint Helena",
    Blocked: false,
    Clients: 0,
    Code: "SH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65de",
    },
    Name: "Saint Kitts and Nevis",
    Blocked: false,
    Clients: 0,
    Code: "KN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65df",
    },
    Name: "Saint Lucia",
    Blocked: false,
    Clients: 0,
    Code: "LC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e0",
    },
    Name: "Saint Pierre and Miquelon",
    Blocked: false,
    Clients: 0,
    Code: "PM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e1",
    },
    Name: "Saint Vincent and the Grenadines",
    Blocked: false,
    Clients: 0,
    Code: "VC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e2",
    },
    Name: "Samoa",
    Blocked: false,
    Clients: 0,
    Code: "WS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e3",
    },
    Name: "San Marino",
    Blocked: false,
    Clients: 0,
    Code: "SM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e4",
    },
    Name: "Sao Tome and Principe",
    Blocked: false,
    Clients: 0,
    Code: "ST",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e5",
    },
    Name: "Saudi Arabia",
    Blocked: false,
    Clients: 0,
    Code: "SA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e6",
    },
    Name: "Senegal",
    Blocked: false,
    Clients: 0,
    Code: "SN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e7",
    },
    Name: "Serbia and Montenegro",
    Blocked: false,
    Clients: 0,
    Code: "CS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e8",
    },
    Name: "Seychelles",
    Blocked: false,
    Clients: 0,
    Code: "SC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65e9",
    },
    Name: "Sierra Leone",
    Blocked: false,
    Clients: 0,
    Code: "SL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ea",
    },
    Name: "Singapore",
    Blocked: false,
    Clients: 0,
    Code: "SG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65eb",
    },
    Name: "Slovakia",
    Blocked: false,
    Clients: 0,
    Code: "SK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ec",
    },
    Name: "Slovenia",
    Blocked: false,
    Clients: 0,
    Code: "SI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ed",
    },
    Name: "Solomon Islands",
    Blocked: false,
    Clients: 0,
    Code: "SB",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ee",
    },
    Name: "Somalia",
    Blocked: false,
    Clients: 0,
    Code: "SO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ef",
    },
    Name: "South Africa",
    Blocked: false,
    Clients: 0,
    Code: "ZA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f0",
    },
    Name: "South Georgia and the South Sandwich Islands",
    Blocked: false,
    Clients: 0,
    Code: "GS",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f1",
    },
    Name: "Spain",
    Blocked: false,
    Clients: 0,
    Code: "ES",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f2",
    },
    Name: "Sri Lanka",
    Blocked: false,
    Clients: 0,
    Code: "LK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f3",
    },
    Name: "Sudan",
    Blocked: false,
    Clients: 0,
    Code: "SD",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f4",
    },
    Name: "Suriname",
    Blocked: false,
    Clients: 0,
    Code: "SR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f5",
    },
    Name: "Svalbard and Jan Mayen",
    Blocked: false,
    Clients: 0,
    Code: "SJ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f6",
    },
    Name: "Swaziland",
    Blocked: false,
    Clients: 0,
    Code: "SZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f7",
    },
    Name: "Sweden",
    Blocked: false,
    Clients: 0,
    Code: "SE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f8",
    },
    Name: "Switzerland",
    Blocked: false,
    Clients: 0,
    Code: "CH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65f9",
    },
    Name: "Syrian Arab Republic",
    Blocked: false,
    Clients: 0,
    Code: "SY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65fa",
    },
    Name: "Taiwan, Province of China",
    Blocked: false,
    Clients: 0,
    Code: "TW",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65fb",
    },
    Name: "Tajikistan",
    Blocked: false,
    Clients: 0,
    Code: "TJ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65fc",
    },
    Name: "Tanzania, United Republic of",
    Blocked: false,
    Clients: 0,
    Code: "TZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65fd",
    },
    Name: "Thailand",
    Blocked: false,
    Clients: 0,
    Code: "TH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65fe",
    },
    Name: "Timor-Leste",
    Blocked: false,
    Clients: 0,
    Code: "TL",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf65ff",
    },
    Name: "Togo",
    Blocked: false,
    Clients: 0,
    Code: "TG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6600",
    },
    Name: "Tokelau",
    Blocked: false,
    Clients: 0,
    Code: "TK",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6601",
    },
    Name: "Tonga",
    Blocked: false,
    Clients: 0,
    Code: "TO",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6602",
    },
    Name: "Trinidad and Tobago",
    Blocked: false,
    Clients: 0,
    Code: "TT",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6603",
    },
    Name: "Tunisia",
    Blocked: false,
    Clients: 0,
    Code: "TN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6604",
    },
    Name: "Turkey",
    Blocked: false,
    Clients: 0,
    Code: "TR",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6605",
    },
    Name: "Turkmenistan",
    Blocked: false,
    Clients: 0,
    Code: "TM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6606",
    },
    Name: "Turks and Caicos Islands",
    Blocked: false,
    Clients: 0,
    Code: "TC",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6607",
    },
    Name: "Tuvalu",
    Blocked: false,
    Clients: 0,
    Code: "TV",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6608",
    },
    Name: "Uganda",
    Blocked: false,
    Clients: 0,
    Code: "UG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6609",
    },
    Name: "Ukraine",
    Blocked: false,
    Clients: 0,
    Code: "UA",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660a",
    },
    Name: "United Arab Emirates",
    Blocked: false,
    Clients: 0,
    Code: "AE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660b",
    },
    Name: "United Kingdom",
    Blocked: false,
    Clients: 0,
    Code: "GB",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660c",
    },
    Name: "United States",
    Blocked: false,
    Clients: 0,
    Code: "US",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660d",
    },
    Name: "United States Minor Outlying Islands",
    Blocked: false,
    Clients: 0,
    Code: "UM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660e",
    },
    Name: "Uruguay",
    Blocked: false,
    Clients: 0,
    Code: "UY",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf660f",
    },
    Name: "Uzbekistan",
    Blocked: false,
    Clients: 0,
    Code: "UZ",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6610",
    },
    Name: "Vanuatu",
    Blocked: false,
    Clients: 0,
    Code: "VU",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6611",
    },
    Name: "Venezuela",
    Blocked: false,
    Clients: 0,
    Code: "VE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6612",
    },
    Name: "Viet Nam",
    Blocked: false,
    Clients: 0,
    Code: "VN",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6613",
    },
    Name: "Virgin Islands, British",
    Blocked: false,
    Clients: 0,
    Code: "VG",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6614",
    },
    Name: "Virgin Islands, U.S.",
    Blocked: false,
    Clients: 0,
    Code: "VI",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6615",
    },
    Name: "Wallis and Futuna",
    Blocked: false,
    Clients: 0,
    Code: "WF",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6616",
    },
    Name: "Western Sahara",
    Blocked: false,
    Clients: 0,
    Code: "EH",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6617",
    },
    Name: "Yemen",
    Blocked: false,
    Clients: 0,
    Code: "YE",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6618",
    },
    Name: "Zambia",
    Blocked: false,
    Clients: 0,
    Code: "ZM",
  },
  {
    _id: {
      oid: "625c90408ea9f1ca0dbf6619",
    },
    Name: "Zimbabwe",
    Blocked: false,
    Clients: 0,
    Code: "ZW",
  },
];

for (let index = 0; index < AllCountries.length; index++) {
  const Country = AllCountries[index];
  delete Country._id;
  Country.Blocked = false;
  Country.Clients = 0;
  Country.CreatedAt = new Date();
  Country.UpdatedAt = new Date();
  Countries.push(Country);
}

export default Countries;
