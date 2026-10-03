export interface KarnatakaDistrict {
  id: string;
  name: string;
  division: "Bengaluru" | "Belagavi" | "Kalaburagi" | "Mysuru";
  latitude: number;
  longitude: number;
  majorHubs: string[];
}

export const KARNATAKA_DISTRICTS: KarnatakaDistrict[] = [
  { id: "bengaluru-urban", name: "Bengaluru Urban", division: "Bengaluru", latitude: 12.9716, longitude: 77.5946, majorHubs: ["Koramangala", "Whitefield", "Indiranagar", "Electronic City", "HSR Layout", "Yelahanka"] },
  { id: "bengaluru-rural", name: "Bengaluru Rural", division: "Bengaluru", latitude: 13.2389, longitude: 77.5819, majorHubs: ["Devanahalli", "Doddaballapura", "Nelamangala"] },
  { id: "mysuru", name: "Mysuru", division: "Mysuru", latitude: 12.2958, longitude: 76.6394, majorHubs: ["Hebbal Industrial Area", "Jayalakshmipuram", "Kuvempunagar", "Vijayanagar"] },
  { id: "dakshina-kannada", name: "Dakshina Kannada (Mangaluru)", division: "Mysuru", latitude: 12.9141, longitude: 74.8560, majorHubs: ["Mangaluru City", "Surathkal", "Kottara Chowki", "Derebail"] },
  { id: "dharwad", name: "Dharwad (Hubballi-Dharwad)", division: "Belagavi", latitude: 15.3647, longitude: 75.1240, majorHubs: ["Hubballi IT Park", "Vidyanagar", "Dharwad Campus", "Navanagar"] },
  { id: "belagavi", name: "Belagavi", division: "Belagavi", latitude: 15.8497, longitude: 74.4977, majorHubs: ["Udyambag", "Tilakwadi", "Kuvempu Nagar"] },
  { id: "kalaburagi", name: "Kalaburagi (Gulbarga)", division: "Kalaburagi", latitude: 17.3297, longitude: 76.8343, majorHubs: ["Sedam Road", "University Area", "Shahbazar"] },
  { id: "shivamogga", name: "Shivamogga (Shimoga)", division: "Bengaluru", latitude: 13.9299, longitude: 75.5681, majorHubs: ["Gopala", "Savalanga Road", "Vidyanagar"] },
  { id: "udupi", name: "Udupi", division: "Mysuru", latitude: 13.3409, longitude: 74.7421, majorHubs: ["Manipal", "Karkala", "Malpe"] },
  { id: "tumakuru", name: "Tumakuru (Tumkur)", division: "Bengaluru", latitude: 13.3379, longitude: 77.1173, majorHubs: ["Siddaganga", "Batawadi", "Vasanthanarasapura"] },
  { id: "ballari", name: "Ballari (Bellary)", division: "Kalaburagi", latitude: 15.1394, longitude: 76.9214, majorHubs: ["Cantonment", "Siruguppa Road"] },
  { id: "davanagere", name: "Davanagere", division: "Bengaluru", latitude: 14.4644, longitude: 75.9218, majorHubs: ["MCC Block", "Shamanur Road"] },
  { id: "hassan", name: "Hassan", division: "Mysuru", latitude: 13.0072, longitude: 76.1030, majorHubs: ["Vidya Nagar", "Industrial Area"] },
  { id: "mandya", name: "Mandya", division: "Mysuru", latitude: 12.5244, longitude: 76.8958, majorHubs: ["Sugar Town", "PES College Road"] },
  { id: "uttara-kannada", name: "Uttara Kannada (Karwar)", division: "Belagavi", latitude: 14.8185, longitude: 74.1350, majorHubs: ["Karwar", "Bhatkal", "Sirsi"] },
  { id: "bagalkote", name: "Bagalkote", division: "Belagavi", latitude: 16.1691, longitude: 75.6615, majorHubs: ["Navanagar", "Vidyagiri"] },
  { id: "vijayapura", name: "Vijayapura (Bijapur)", division: "Belagavi", latitude: 16.8302, longitude: 75.7100, majorHubs: ["Ashram Road", "Solapur Road"] },
  { id: "raichur", name: "Raichur", division: "Kalaburagi", latitude: 16.2120, longitude: 77.3439, majorHubs: ["Station Road", "Askihal"] },
  { id: "bidar", name: "Bidar", division: "Kalaburagi", latitude: 17.9104, longitude: 77.5199, majorHubs: ["Naubad", "Gumpa"] },
  { id: "koppal", name: "Koppal", division: "Kalaburagi", latitude: 15.3467, longitude: 76.1557, majorHubs: ["Kinnal Road", "Hospet Road"] },
  { id: "gadag", name: "Gadag", division: "Belagavi", latitude: 15.4297, longitude: 75.6322, majorHubs: ["Betageri", "Mulagund Road"] },
  { id: "haveri", name: "Haveri", division: "Belagavi", latitude: 14.7954, longitude: 75.3991, majorHubs: ["Vidyanagar", "PB Road"] },
  { id: "chikkamagaluru", name: "Chikkamagaluru", division: "Mysuru", latitude: 13.3161, longitude: 75.7720, majorHubs: ["KM Road", "Ramanahalli"] },
  { id: "kodagu", name: "Kodagu (Madikeri)", division: "Mysuru", latitude: 12.4244, longitude: 75.7382, majorHubs: ["Madikeri", "Kushalnagar"] },
  { id: "chamarajanagar", name: "Chamarajanagar", division: "Mysuru", latitude: 11.9261, longitude: 76.9437, majorHubs: ["Santhemarahalli", "Gundlupet"] },
  { id: "chikkaballapura", name: "Chikkaballapura", division: "Bengaluru", latitude: 13.4325, longitude: 77.7275, majorHubs: ["Bagepalli", "Chintamani"] },
  { id: "kolar", name: "Kolar", division: "Bengaluru", latitude: 13.1367, longitude: 78.1340, majorHubs: ["KGF", "Bangarapet", "Tamaka"] },
  { id: "ramanagara", name: "Ramanagara", division: "Bengaluru", latitude: 12.7209, longitude: 77.2799, majorHubs: ["Bidadi Industrial Area", "Channapatna", "Kanakapura"] },
  { id: "yadgir", name: "Yadgir", division: "Kalaburagi", latitude: 16.7700, longitude: 77.1300, majorHubs: ["Chittapur Road", "Station Area"] },
  { id: "chitradurga", name: "Chitradurga", division: "Bengaluru", latitude: 14.2251, longitude: 76.4026, majorHubs: ["Kelagote", "Holalkere Road"] },
  { id: "vijayanagara", name: "Vijayanagara (Hosapete)", division: "Kalaburagi", latitude: 15.2689, longitude: 76.3909, majorHubs: ["Hosapete", "Hampi Heritage Area"] }
];
