import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  useMediaQuery,
  TextareaAutosize,
  Backdrop,
} from "@mui/material";
import apiClient from "../apiClient";
import UserRegistration from "./UserRegistration";
import UserManagement from "./UserManagement";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [editedSubmissions, setEditedSubmissions] = useState({});
  const [userRole, setUserRole] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!token) {
      setErrorMessage("You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    // Decode token to get user role
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch {
        return null;
      }
    };

    const decoded = parseJwt(token);
    setUserRole(decoded?.role || null);

    const fetchData = async () => {
      try {
        const [catRes, agencyRes, submissionsRes] = await Promise.all([
          apiClient.get("/admin/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/admin/agencies", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/admin/submissions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(catRes.data);
        setAgencies(agencyRes.data);
        setSubmissions(submissionsRes.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          "Failed to fetch data. Please check your login and try again.",
          error
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleFieldChange = (id, field, value) => {
    setEditedSubmissions((prev) => {
      const prevSubmission =
        prev[id] || submissions.find((s) => s.id === id) || {};
      return {
        ...prev,
        [id]: {
          ...prevSubmission,
          [field]: value,
        },
      };
    });
  };

  const handleSave = async (id) => {
    setUpdateMessage("");
    setErrorMessage("");
    setActionLoading(true);
    try {
      const edited = editedSubmissions[id];
      if (!edited) {
        setErrorMessage("No changes to save.");
        setActionLoading(false);
        return;
      }
      const updatedSubmission = {
        category_id: edited.category
          ? edited.category.id || edited.category_id
          : edited.category_id || null,
        agency_id: edited.agency
          ? edited.agency.id || edited.agency_id
          : edited.agency_id || null,
        status: edited.status,
        public_response: edited.public_response || "",
        internal_notes: edited.internal_notes || "",
      };

      await apiClient.put(`/admin/submissions/${id}`, updatedSubmission, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...edited } : s))
      );
      setEditedSubmissions((prev) => {
        const newEdits = { ...prev };
        delete newEdits[id];
        return newEdits;
      });
      setActionLoading(false);
      setUpdateMessage("Submission updated successfully.");
    } catch (error) {
      setErrorMessage("Failed to update submission.", error);
    }
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    setUpdateMessage("");
    setErrorMessage("");
    setActionLoading(true);
    try {
      await apiClient.delete(`/admin/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setUpdateMessage("Submission deleted successfully.");
    } catch (error) {
      setErrorMessage("Failed to delete submission.", error);
    }
    setActionLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  // Determine tabs to show based on user role
  const tabs = [];
  if (userRole === "admin") {
    tabs.push(<Tab key="manage-submissions" label="Manage Submissions" />);
    tabs.push(<Tab key="user-registration" label="User Registration" />);
    tabs.push(<Tab key="user-management" label="User Management" />);
  } else if (userRole === "agency") {
    tabs.push(<Tab key="manage-submissions" label="Manage Submissions" />);
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Backdrop open={actionLoading} sx={{ color: '#fff', zIndex:(theme) => theme.zIndex.drawer+1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        variant={isSmallScreen ? "scrollable" : "standard"}
        scrollButtons={isSmallScreen ? "auto" : false}
        allowScrollButtonsMobile
      >
        {tabs}
      </Tabs>
      {updateMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {updateMessage}
        </Alert>
      )}
      {tabIndex === 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{ minWidth: isSmallScreen ? 700 : undefined }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tracking ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Agency</TableCell>
                  <TableCell>Public Response</TableCell>
                  <TableCell>Internal Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.tracking_id}</TableCell>
                    <TableCell>{submission.title}</TableCell>
                    <TableCell>{submission.submission_type}</TableCell>
                    <TableCell>
                      <Select
                        value={
                          editedSubmissions[submission.id]?.status ??
                          submission.status
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            submission.id,
                            "status",
                            e.target.value
                          )
                        }
                        size="small"
                      >
                        {[
                          "Submitted",
                          "Under Review",
                          "Assigned to Agency",
                          "In Progress",
                          "Resolved",
                          "Closed",
                        ].map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={
                          editedSubmissions[submission.id]?.category_id ??
                          submission.category?.id ??
                          ""
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            submission.id,
                            "category_id",
                            e.target.value
                          )
                        }
                        size="small"
                        disabled={userRole === "agency"}
                      >
                        <MenuItem value="">None</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={
                          editedSubmissions[submission.id]?.agency_id ??
                          submission.agency?.id ??
                          ""
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            submission.id,
                            "agency_id",
                            e.target.value
                          )
                        }
                        size="small"
                        disabled={userRole === "agency"}
                      >
                        <MenuItem value="">None</MenuItem>
                        {agencies.map((agency) => (
                          <MenuItem key={agency.id} value={agency.id}>
                            {agency.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextareaAutosize
                        minRows={2}
                        maxRows={6}
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          padding: 8,
                          borderRadius: 4,
                          border: "1px solid #ccc",
                          resize: "vertical",
                          fontFamily: "inherit",
                          background: "inherit",
                        }}
                        value={
                          editedSubmissions[submission.id]?.public_response ??
                          submission.public_response ??
                          ""
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            submission.id,
                            "public_response",
                            e.target.value
                          )
                        }
                        placeholder="Enter public response"
                      />
                    </TableCell>
                    <TableCell>
                      <TextareaAutosize
                        minRows={2}
                        maxRows={6}
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          padding: 8,
                          borderRadius: 4,
                          border: "1px solid #ccc",
                          resize: "vertical",
                          fontFamily: "inherit",
                          background: "inherit",
                        }}
                        value={
                          editedSubmissions[submission.id]?.internal_notes ??
                          submission.internal_notes ??
                          ""
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            submission.id,
                            "internal_notes",
                            e.target.value
                          )
                        }
                        placeholder="Enter internal notes"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSave(submission.id)}
                        sx={{ mr: 1 }}
                        disabled={!editedSubmissions[submission.id]}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(submission.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {userRole === "admin" && tabIndex === 1 && <UserRegistration />}
      {userRole === "admin" && tabIndex === 2 && <UserManagement />}
    </Box>
  );
};

export default AdminDashboard;
