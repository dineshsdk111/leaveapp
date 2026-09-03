const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const students = [
  { name: "ABDUL FAIYAZ S M", rollNumber: "310624205001", email: "310624205001@eec.srmrmp.edu.in" },
  { name: "ABHILASSHA D", rollNumber: "310624205002", email: "310624205002@eec.srmrmp.edu.in" },
  { name: "ABINAV D R", rollNumber: "310624205003", email: "310624205003@eec.srmrmp.edu.in" },
  { name: "ADITHYA HARAN B", rollNumber: "310624205004", email: "310624205004@eec.srmrmp.edu.in" },
  { name: "ADITHYAN B", rollNumber: "310624205005", email: "310624205005@eec.srmrmp.edu.in" },
  { name: "AISHWARYA S", rollNumber: "310624205006", email: "310624205006@eec.srmrmp.edu.in" },
  { name: "AJAY KANNAN R", rollNumber: "310624205007", email: "310624205007@eec.srmrmp.edu.in" },
  { name: "AKASHKISHORE", rollNumber: "310624205008", email: "310624205008@eec.srmrmp.edu.in" },
  { name: "AKSHAY J", rollNumber: "310624205009", email: "310624205009@eec.srmrmp.edu.in" },
  { name: "AKSHAYA J D", rollNumber: "310624205010", email: "310624205010@eec.srmrmp.edu.in" },
  { name: "AKSHAYA P N", rollNumber: "310624205011", email: "310624205011@eec.srmrmp.edu.in" },
  { name: "ALAGU SURYA S", rollNumber: "310624205012", email: "310624205012@eec.srmrmp.edu.in" },
  { name: "ALLEN ABISHAI J", rollNumber: "310624205013", email: "310624205013@eec.srmrmp.edu.in" },
  { name: "ALVINA DELCIA", rollNumber: "310624205014", email: "310624205014@eec.srmrmp.edu.in" },
  { name: "ANAFA THABASSUM S", rollNumber: "310624205015", email: "310624205015@eec.srmrmp.edu.in" },
  { name: "ANBITHA V", rollNumber: "310624205017", email: "310624205017@eec.srmrmp.edu.in" },
  { name: "ANGEL NIKHITHA J", rollNumber: "310624205018", email: "310624205018@eec.srmrmp.edu.in" },
  { name: "ANIRUDHRAM G", rollNumber: "310624205019", email: "310624205019@eec.srmrmp.edu.in" },
  { name: "ANISHKUMAR R", rollNumber: "310624205020", email: "310624205020@eec.srmrmp.edu.in" },
  { name: "ANNAPOORANI A", rollNumber: "310624205021", email: "310624205021@eec.srmrmp.edu.in" },
  { name: "APARNAA K S", rollNumber: "310624205022", email: "310624205022@eec.srmrmp.edu.in" },
  { name: "ARISTOTLE S", rollNumber: "310624205023", email: "310624205023@eec.srmrmp.edu.in" },
  { name: "ARUN KUMAR R", rollNumber: "310624205024", email: "310624205024@eec.srmrmp.edu.in" },
  { name: "ARUN P", rollNumber: "310624205025", email: "310624205025@eec.srmrmp.edu.in" },
  { name: "ARUN VARSHAN A S", rollNumber: "310624205026", email: "310624205026@eec.srmrmp.edu.in" },
  { name: "ARYA S Y", rollNumber: "310624205027", email: "310624205027@eec.srmrmp.edu.in" },
  { name: "ASHIKA PREM KUMAR", rollNumber: "310624205028", email: "310624205028@eec.srmrmp.edu.in" },
  { name: "ASHKEN R", rollNumber: "310624205029", email: "310624205029@eec.srmrmp.edu.in" },
  { name: "ASHWIN T", rollNumber: "310624205030", email: "310624205030@eec.srmrmp.edu.in" },
  { name: "ATCHAYAVASIKARAN V", rollNumber: "310624205031", email: "310624205031@eec.srmrmp.edu.in" },
  { name: "BANUSRI K", rollNumber: "310624205032", email: "310624205032@eec.srmrmp.edu.in" },
  { name: "BHAVADHARANI M", rollNumber: "310624205033", email: "310624205033@eec.srmrmp.edu.in" },
  { name: "BHAVYA SHRREE G", rollNumber: "310624205034", email: "310624205034@eec.srmrmp.edu.in" },
  { name: "BHAWANITHA N", rollNumber: "310624205035", email: "310624205035@eec.srmrmp.edu.in" },
  { name: "BHUVANESWARI B", rollNumber: "310624205036", email: "310624205036@eec.srmrmp.edu.in" },
  { name: "BRYANE ANGELO J", rollNumber: "310624205037", email: "310624205037@eec.srmrmp.edu.in" },
  { name: "CHAMALA SATHVIKA", rollNumber: "310624205039", email: "310624205039@eec.srmrmp.edu.in" },
  { name: "CHITHRA S", rollNumber: "310624205040", email: "310624205040@eec.srmrmp.edu.in" },
  { name: "DARSHAN G", rollNumber: "310624205041", email: "310624205041@eec.srmrmp.edu.in" },
  { name: "DEEPAN D", rollNumber: "310624205042", email: "310624205042@eec.srmrmp.edu.in" },
  { name: "DELLANO SAMUEL FERNANDEZ", rollNumber: "310624205043", email: "310624205043@eec.srmrmp.edu.in" },
  { name: "DESU MIDHUN", rollNumber: "310624205044", email: "310624205044@eec.srmrmp.edu.in" },
  { name: "DEVADARSHANI G Y", rollNumber: "310624205045", email: "310624205045@eec.srmrmp.edu.in" },
  { name: "DHAKSHIN T", rollNumber: "310624205046", email: "310624205046@eec.srmrmp.edu.in" },
  { name: "DHANISHTA V", rollNumber: "310624205047", email: "310624205047@eec.srmrmp.edu.in" },
  { name: "DHARSHINI B", rollNumber: "310624205048", email: "310624205048@eec.srmrmp.edu.in" },
  { name: "DHARSHNI R T", rollNumber: "310624205049", email: "310624205049@eec.srmrmp.edu.in" },
  { name: "DHARUNIKA T", rollNumber: "310624205050", email: "310624205050@eec.srmrmp.edu.in" },
  { name: "DHIVIN KUMAR P", rollNumber: "310624205051", email: "310624205051@eec.srmrmp.edu.in" },
  { name: "DHIVIYA SITHA S", rollNumber: "310624205052", email: "310624205052@eec.srmrmp.edu.in" },
  { name: "DINESH B", rollNumber: "310624205053", email: "310624205053@eec.srmrmp.edu.in" },
  { name: "DINESH S (07.07.2006)", rollNumber: "310624205054", email: "310624205054@eec.srmrmp.edu.in" },
  { name: "DINESH S (14.01.2007)", rollNumber: "310624205055", email: "310624205055@eec.srmrmp.edu.in" },
  { name: "DINESHKUMAR S", rollNumber: "310624205056", email: "310624205056@eec.srmrmp.edu.in" },
  { name: "DIVYA C", rollNumber: "310624205057", email: "310624205057@eec.srmrmp.edu.in" },
  { name: "DIVYA DARSHINI G", rollNumber: "310624205058", email: "310624205058@eec.srmrmp.edu.in" },
  { name: "DIVYASRI K", rollNumber: "310624205059", email: "310624205059@eec.srmrmp.edu.in" },
  { name: "EMMANUEL ROSHAN K", rollNumber: "310624205060", email: "310624205060@eec.srmrmp.edu.in" },
  { name: "ENIYA S", rollNumber: "310624205061", email: "310624205061@eec.srmrmp.edu.in" },
  { name: "FABIAN J", rollNumber: "310624205062", email: "310624205062@eec.srmrmp.edu.in" },
  { name: "FAHIMA FAHMITHA M", rollNumber: "310624205063", email: "310624205063@eec.srmrmp.edu.in" }
];

const faculty = {
  name: "SUNDAR K",
  email: "sundar.k@eec.srmrmp.edu.in",
  rollNumber: "FACULTY001",
  role: "faculty",
  password: "faculty123"
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create students with default password = rollNumber
    const studentDocs = students.map(s => ({
      ...s,
      password: s.rollNumber,
      role: 'student',
      year: 'III',
      department: 'IT',
      section: 'A'
    }));

    for (const s of studentDocs) {
      await User.create(s);
    }
    console.log(`Seeded ${studentDocs.length} students`);

    // Create faculty
    await User.create(faculty);
    console.log('Seeded faculty: sundar.k@eec.srmrmp.edu.in');

    console.log('\n--- Login Credentials ---');
    console.log('Students: Use your roll number as password');
    console.log('Example: 310624205001@eec.srmrmp.edu.in / 310624205001');
    console.log('\nFaculty: sundar.k@eec.srmrmp.edu.in / faculty123');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
