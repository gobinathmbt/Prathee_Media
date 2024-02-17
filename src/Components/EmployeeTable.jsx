import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:8083";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .required("Firstname is required")
    .max(30, "Firstname must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  lastname: Yup.string()
    .required("Lastname is required")
    .max(30, "Lastname must be at most 30 characters")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets and spaces are allowed"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Phone number must be a 10-digit number without spaces or special characters"
    )
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
});

const EmployeeTable = () => {
  const [employee, setemployee] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEmployees, setselectedEmployees] = useState({});
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchemployee();
  }, []);

  const fetchemployee = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_employee`);
      setemployee(response.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleEditModalOpen = (employee) => {
    setselectedEmployees(employee);
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
  };

  const handleDeleteConfirmationOpen = (employee) => {
    setselectedEmployees(employee);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleEditemployee = async (values) => {
    try {
      await axios.put(`${API_URL}/edit_employee/${selectedEmployees.uid}`, {
        ...values,
        phoneNumber: values.phoneNumber,
        address: values.address,
      });
      fetchemployee();
      handleEditModalClose();
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };

  const handleAddemployee = async (values) => {
    try {
      await axios.post(`${API_URL}/create_employee`, {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
      });
      fetchemployee();
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
  const handleDeleteemployee = async () => {
    try {
      await axios.delete(`${API_URL}/delete_employee/${selectedEmployees.uid}`);
      fetchemployee();
      handleDeleteConfirmationClose();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filterEmployeesByAPI = async (query) => {
    console.log(query)
    try {
      const response = await axios.get(`${API_URL}/filter_employee`, {
        params: { query },
      });
      console.log(response.data)
      setemployee(response.data);
    } catch (error) {
      console.error("Error filtering employees:", error);
    }
  };

  // Function to handle changes in the search query
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Update the search query state
    filterEmployeesByAPI(query); // Call API to filter employees
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "800" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Firstname</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Lastname</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "800" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employee.map((employee, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontWeight: "700" }}>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {employee.firstname}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {employee.lastname}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {employee.email}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {employee.phoneNumber}
                </TableCell>
                <TableCell sx={{ fontWeight: "500" }}>
                  {employee.address}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteConfirmationOpen(employee)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openEditModal} onClose={handleEditModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Edit employee</h2>
          <Formik
            initialValues={{
              firstname: selectedEmployees.firstname,
              lastname: selectedEmployees.lastname,
              email: selectedEmployees.email,
              phoneNumber: selectedEmployees.phoneNumber,
              address: selectedEmployees.address,
            }}
            validationSchema={validationSchema}
            onSubmit={handleEditemployee}
          >
            {({ errors, touched }) => (
              <Form>
                <div
                  style={{ display: "flex", marginBottom: "10px", gap: "15px" }}
                >
                  <Field
                    as={TextField}
                    label="Firstname"
                    name="firstname"
                    fullWidth
                    error={errors.firstname && touched.firstname}
                    helperText={
                      errors.firstname && touched.firstname && errors.firstname
                    }
                  />
                  <Field
                    as={TextField}
                    label="Lastname"
                    name="lastname"
                    fullWidth
                    error={errors.lastname && touched.lastname}
                    helperText={
                      errors.lastname && touched.lastname && errors.lastname
                    }
                  />
                </div>
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                </div>
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <Field
                    as={TextField}
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    error={errors.phoneNumber && touched.phoneNumber}
                    helperText={
                      errors.phoneNumber &&
                      touched.phoneNumber &&
                      errors.phoneNumber
                    }
                  />
                </div>
                <Field
                  as={TextField}
                  label="Address"
                  name="address"
                  fullWidth
                  error={errors.address && touched.address}
                  helperText={
                    errors.address && touched.address && errors.address
                  }
                  style={{ marginBottom: "10px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleEditModalClose}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Dialog
        open={openDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeleteemployee} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openAddModal} onClose={handleAddModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Add New employee</h2>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
              phoneNumber: "",
              address: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddemployee}
          >
            {({ errors, touched }) => (
              <Form>
                <div
                  style={{ display: "flex", marginBottom: "10px", gap: "15px" }}
                >
                  <Field
                    as={TextField}
                    label="Firstname"
                    name="firstname"
                    fullWidth
                    error={errors.firstname && touched.firstname}
                    helperText={
                      errors.firstname && touched.firstname && errors.firstname
                    }
                  />
                  <Field
                    as={TextField}
                    label="Lastname"
                    name="lastname"
                    fullWidth
                    error={errors.lastname && touched.lastname}
                    helperText={
                      errors.lastname && touched.lastname && errors.lastname
                    }
                  />
                </div>
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                </div>
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  <Field
                    as={TextField}
                    label="Phone Number"
                    name="phoneNumber"
                    fullWidth
                    error={errors.phoneNumber && touched.phoneNumber}
                    helperText={
                      errors.phoneNumber &&
                      touched.phoneNumber &&
                      errors.phoneNumber
                    }
                  />
                </div>
                <Field
                  as={TextField}
                  label="Address"
                  name="address"
                  fullWidth
                  error={errors.address && touched.address}
                  helperText={
                    errors.address && touched.address && errors.address
                  }
                  style={{ marginBottom: "10px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleEditModalClose}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleAddModalOpen}
        sx={{ marginTop: "20px" }}
      >
        Add New employee
      </Button>
    </Box>
  );
};

export default EmployeeTable;
