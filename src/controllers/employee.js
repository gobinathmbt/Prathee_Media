const crypto = require('crypto');
const Employee = require("../models/model").Employee;

const get_employee = async (req, res) => {
  try {
    const employees = await Employee.find({ is_active: true, is_deleted: false });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create_employee = async (req, res) => {
  if (!req.body.firstname) {
    return res.status(400).json({ message: "Firstname is Required." });
  }

  if (!req.body.lastname) {
    return res.status(400).json({ message: "Lastname is Required." });
  }

  if (!req.body.email) {
    return res.status(400).json({ message: "Email is Required." });
  }
  if (!req.body.phoneNumber) {
    return res.status(400).json({ message: "phoneNumber is Required." });
  }
  if (!req.body.address) {
    return res.status(400).json({ message: "address is Required." });
  }

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;

  const uid = crypto.randomBytes(16).toString("hex");
  const employeeData = {
    uid: uid,
    firstname: firstname,
    lastname: lastname,
    email: email,
    phoneNumber: phoneNumber,
    address: address
  };
  try {
    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json({ message: "Employee Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const edit_employee = async (req, res) => {
  try {
    const employeeUid = req.params.uid;

    if (!req.body.firstname) {
      return res.status(400).json({ message: "Firstname is Required." });
    }

    if (!req.body.lastname) {
      return res.status(400).json({ message: "Lastname is Required." });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email is Required." });
    }
    if (!req.body.phoneNumber) {
      return res.status(400).json({ message: "phoneNumber is Required." });
    }
    if (!req.body.address) {
      return res.status(400).json({ message: "address is Required." });
    }

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;

    const updatedData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phoneNumber: phoneNumber,
      address: address
    };

    const employee = await Employee.findOneAndUpdate({ uid: employeeUid }, updatedData, { new: true });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete_employee = async (req, res) => {
  try {
    const employeeUid = req.params.uid;
    if (!employeeUid) {
      return res.status(400).json({ message: "Employee UID is required" });
    }
    const employee = await Employee.findOneAndUpdate({ uid: employeeUid }, { is_deleted: true }, { new: true });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const filter_employee = async (req, res) => {
//   const { query } = req.query;

//   try {
//     if (!query || query.trim() === '') {
//       const allEmployees = await Employee.find({ is_active: true, is_deleted: false });
//       return res.json(allEmployees);
//     }

//     // Split the search query by space
//     const searchKeywords = query.toLowerCase().split(' ');

//     const filteredEmployees = await Employee.find({
//       $and: [
//         {
//           $or: [
//             { firstname: { $regex: searchKeywords, $options: 'i' } },
//             { lastname: { $regex: searchKeywords, $options: 'i' } },
//             { email: { $in: searchKeywords } },
//             { phoneNumber: { $in: searchKeywords } },
//             // Handle address search
//             { address: { $regex: searchKeywords.join('|'), $options: 'i' } }, // Match any of the words in the address
//           ]
//         },
//         { is_active: true, is_deleted: false }
//       ]
//     });

//     res.json(filteredEmployees);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const filter_employee = async (req, res) => {
  const { query } = req.query;



  if (!query || query.trim() === '') {
    const allEmployees = await Employee.find({ is_active: true, is_deleted: false });
    return res.json(allEmployees);
  }

  const searchKeywords = query.toLowerCase().split(',');

  try {
    const employees = await Employee.find({ is_active: true, is_deleted: false });

    const filteredEmployees = employees.filter((employee) => {
      const employeeValues = [
        employee.firstname.toLowerCase(),
        employee.lastname.toLowerCase(),
        employee.email.toLowerCase(),
        employee.phoneNumber.toLowerCase(),
        ...employee.address.toLowerCase().split(',')
      ];

      return searchKeywords.every((keyword) =>
        employeeValues.some((value) => value.includes(keyword.trim()))
      );
    });

    res.json(filteredEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  get_employee: get_employee,
  create_employee: create_employee,
  edit_employee: edit_employee,
  delete_employee: delete_employee,
  filter_employee: filter_employee,
};