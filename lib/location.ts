// lib/location.ts

export interface State {
    name: string;
    districts: string[];
  }
  
  export const states: State[] = [
    {
      name: "Andaman and Nicobar Islands",
      districts: ["Nicobar", "North and Middle Andaman", "South Andaman"]
    },
    {
      name: "Andhra Pradesh",
      districts: [
        "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya",
        "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari",
        "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR",
        "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam",
        "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Tirupati",
        "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
      ]
    },
    {
      name: "Arunachal Pradesh",
      districts: [
        "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang",
        "Itanagar Capital Complex", "Kamle", "Kra Daadi", "Kurung Kumey",
        "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang",
        "Lower Subansiri", "Namsai", "Pakke-Kessang", "Papum Pare", "Shi Yomi",
        "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang",
        "Upper Subansiri", "West Kameng", "West Siang"
      ]
    },
    {
      name: "Assam",
      districts: [
        "Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar",
        "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh",
        "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat",
        "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj",
        "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari",
        "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur",
        "Tinsukia", "Udalguri", "West Karbi Anglong"
      ]
    },
    {
      name: "Bihar",
      districts: [
        "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
        "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj",
        "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj",
        "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur",
        "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
        "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
        "Siwan", "Supaul", "Vaishali", "West Champaran"
      ]
    },
    {
      name: "Chandigarh",
      districts: ["Chandigarh"]
    },
    {
      name: "Chhattisgarh",
      districts: [
        "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
        "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi",
        "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Khairagarh",
        "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh",
        "Mohla-Manpur", "Mungeli", "Narayanpur", "Raigarh", "Raipur",
        "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja"
      ]
    },
    {
      name: "Dadra and Nagar Haveli and Daman and Diu",
      districts: ["Dadra and Nagar Haveli", "Daman", "Diu"]
    },
    {
      name: "Delhi",
      districts: [
        "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
        "North East Delhi", "North West Delhi", "Shahdara", "South Delhi",
        "South East Delhi", "South West Delhi", "West Delhi"
      ]
    },
    {
      name: "Goa",
      districts: ["North Goa", "South Goa"]
    },
    {
      name: "Gujarat",
      districts: [
        "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
        "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang",
        "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar",
        "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi",
        "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
        "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
      ]
    },
    {
      name: "Haryana",
      districts: [
        "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad",
        "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal",
        "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula",
        "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
      ]
    },
    {
      name: "Himachal Pradesh",
      districts: [
        "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu",
        "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
      ]
    },
    {
      name: "Jammu and Kashmir",
      districts: [
        "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
        "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch",
        "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian",
        "Srinagar", "Udhampur"
      ]
    },
    {
      name: "Jharkhand",
      districts: [
        "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
        "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
        "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
        "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega",
        "West Singhbhum"
      ]
    },
    {
      name: "Karnataka",
      districts: [
        "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
        "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga",
        "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan",
        "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya",
        "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi",
        "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"
      ]
    },
    {
      name: "Kerala",
      districts: [
        "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
        "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
        "Thiruvananthapuram", "Thrissur", "Wayanad"
      ]
    },
    {
      name: "Ladakh",
      districts: ["Kargil", "Leh"]
    },
    {
      name: "Lakshadweep",
      districts: ["Lakshadweep"]
    },
    {
      name: "Madhya Pradesh",
      districts: [
        "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat",
        "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur",
        "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori",
        "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur",
        "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur",
        "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen",
        "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni",
        "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli",
        "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
      ]
    },
    {
      name: "Maharashtra",
      districts: [
        "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
        "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
        "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
        "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
        "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
        "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
      ]
    },
    {
      name: "Manipur",
      districts: [
        "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
        "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
        "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
      ]
    },
    {
      name: "Meghalaya",
      districts: [
        "East Garo Hills", "East Jaintia Hills", "East Khasi Hills",
        "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi",
        "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
        "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
      ]
    },
    {
      name: "Mizoram",
      districts: [
        "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib",
        "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", "Siaha"
      ]
    },
    {
      name: "Nagaland",
      districts: [
        "Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng",
        "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek",
        "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"
      ]
    },
    {
      name: "Odisha",
      districts: [
        "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh",
        "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur",
        "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara",
        "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
        "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada",
        "Sambalpur", "Sonepur", "Sundargarh"
      ]
    },
    {
      name: "Puducherry",
      districts: ["Karaikal", "Mahe", "Puducherry", "Yanam"]
    },
    {
      name: "Punjab",
      districts: [
        "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
        "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
        "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga",
        "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar",
        "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"
      ]
    },
    {
      name: "Rajasthan",
      districts: [
        "Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran",
        "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi",
        "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman",
        "Dudu", "Dungarpur", "Gangapur City", "Hanumangarh", "Jaipur",
        "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
        "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal-Tijara",
        "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali",
        "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore",
        "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Sri Ganganagar",
        "Tonk", "Udaipur"
      ]
    },
    {
      name: "Sikkim",
      districts: ["Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng", "Gangtok"]
    },
    {
      name: "Tamil Nadu",
      districts: [
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
        "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
        "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
        "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
        "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
        "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
        "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
        "Vellore", "Viluppuram", "Virudhunagar"
      ]
    },
    {
      name: "Telangana",
      districts: [
        "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
        "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
        "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad",
        "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu",
        "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad",
        "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy",
        "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal",
        "Yadadri Bhuvanagiri"
      ]
    },
    {
      name: "Tripura",
      districts: [
        "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala",
        "South Tripura", "Unakoti", "West Tripura"
      ]
    },
    {
      name: "Uttar Pradesh",
      districts: [
        "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya",
        "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
        "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
        "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah",
        "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
        "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur",
        "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj",
        "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri",
        "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba",
        "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad",
        "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli",
        "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
        "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra",
        "Sultanpur", "Unnao", "Varanasi"
      ]
    },
    {
      name: "Uttarakhand",
      districts: [
        "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun",
        "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag",
        "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
      ]
    },
    {
      name: "West Bengal",
      districts: [
        "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
        "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram",
        "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia",
        "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
        "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas",
        "Uttar Dinajpur"
      ]
    },
    {
      name: "Other",
      districts: ["Other"]
    }
  ];
  
  // Pincode to district mapping (sample - you can expand this)
  export const pincodeMapping: Record<string, { district: string; state: string }> = {
    // Kerala
    "695001": { district: "Thiruvananthapuram", state: "Kerala" },
    "682001": { district: "Ernakulam", state: "Kerala" },
    "673001": { district: "Kozhikode", state: "Kerala" },
    "680001": { district: "Thrissur", state: "Kerala" },
    "691001": { district: "Kollam", state: "Kerala" },
    "689001": { district: "Alappuzha", state: "Kerala" },
    "686001": { district: "Kottayam", state: "Kerala" },
    "670001": { district: "Kannur", state: "Kerala" },
    "671001": { district: "Kasaragod", state: "Kerala" },
    "678001": { district: "Palakkad", state: "Kerala" },
    "676001": { district: "Malappuram", state: "Kerala" },
    "685001": { district: "Idukki", state: "Kerala" },
    "673121": { district: "Wayanad", state: "Kerala" },
    "689645": { district: "Pathanamthitta", state: "Kerala" },
  
    // Tamil Nadu
    "600001": { district: "Chennai", state: "Tamil Nadu" },
    "641001": { district: "Coimbatore", state: "Tamil Nadu" },
    "625001": { district: "Madurai", state: "Tamil Nadu" },
    "620001": { district: "Tiruchirappalli", state: "Tamil Nadu" },
    "627001": { district: "Tirunelveli", state: "Tamil Nadu" },
    "629001": { district: "Kanyakumari", state: "Tamil Nadu" },
  
    // Karnataka
    "560001": { district: "Bengaluru Urban", state: "Karnataka" },
    "570001": { district: "Mysuru", state: "Karnataka" },
    "575001": { district: "Dakshina Kannada", state: "Karnataka" },
    "580001": { district: "Dharwad", state: "Karnataka" },
  
    // Maharashtra
    "400001": { district: "Mumbai City", state: "Maharashtra" },
    "411001": { district: "Pune", state: "Maharashtra" },
    "440001": { district: "Nagpur", state: "Maharashtra" },
  
    // Delhi
    "110001": { district: "Central Delhi", state: "Delhi" },
  
    // Andhra Pradesh
    "530001": { district: "Visakhapatnam", state: "Andhra Pradesh" },
    "520001": { district: "Krishna", state: "Andhra Pradesh" },
  
    // Telangana
    "500001": { district: "Hyderabad", state: "Telangana" },
  
    // Gujarat
    "380001": { district: "Ahmedabad", state: "Gujarat" },
    "395001": { district: "Surat", state: "Gujarat" },
  
    // West Bengal
    "700001": { district: "Kolkata", state: "West Bengal" },
  
    // Rajasthan
    "302001": { district: "Jaipur", state: "Rajasthan" },
  
    // Uttar Pradesh
    "226001": { district: "Lucknow", state: "Uttar Pradesh" },
    "211001": { district: "Prayagraj", state: "Uttar Pradesh" },
    "221001": { district: "Varanasi", state: "Uttar Pradesh" },
  
    // Madhya Pradesh
    "462001": { district: "Bhopal", state: "Madhya Pradesh" },
    "452001": { district: "Indore", state: "Madhya Pradesh" },
  
    // Bihar
    "800001": { district: "Patna", state: "Bihar" },
  
    // Odisha
    "751001": { district: "Khordha", state: "Odisha" },
  
    // Punjab
    "141001": { district: "Ludhiana", state: "Punjab" },
    "143001": { district: "Amritsar", state: "Punjab" },
  
    // Haryana
    "122001": { district: "Gurugram", state: "Haryana" },
    "121001": { district: "Faridabad", state: "Haryana" },
  
    // Himachal Pradesh
    "171001": { district: "Shimla", state: "Himachal Pradesh" },
  
    // Uttarakhand
    "248001": { district: "Dehradun", state: "Uttarakhand" },
  
    // Jharkhand
    "834001": { district: "Ranchi", state: "Jharkhand" },
  
    // Assam
    "781001": { district: "Kamrup Metropolitan", state: "Assam" },
  
    // Goa
    "403001": { district: "North Goa", state: "Goa" },
  
    // Chandigarh
    "160001": { district: "Chandigarh", state: "Chandigarh" },
  };
  
  export const getAllStates = (): string[] => {
    return states.map(state => state.name);
  };
  
  export const getDistrictsByState = (stateName: string): string[] => {
    const state = states.find(s => s.name === stateName);
    return state ? state.districts : [];
  };
  
  export const validatePincode = (pincode: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pincode);
  };
  
  export const getLocationFromPincode = (pincode: string): { district: string; state: string } | null => {
    return pincodeMapping[pincode] || null;
  };