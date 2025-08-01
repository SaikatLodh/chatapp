"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { transformImage } from "@/features/features";
import { useGetAllUsers } from "@/hooks/react-query/react-hooks/admin/adminHook";
import AdminLoader from "../account/AdminLoader";

interface TransformedUser {
  _id: string;
  id: string;
  name: string;
  username: string;
  avatar: string;
  friends: number;
  groups: number;
}

interface Column {
  field: keyof TransformedUser;
  headerName: string;
  headerClassName: string;
  width: number;
  renderCell?: (params: { row: TransformedUser }) => React.ReactNode;
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement: React.FC = () => {
  const { data, isLoading } = useGetAllUsers();
  const [rows, setRows] = useState<TransformedUser[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (data) {
      const transformed = data.map(
        (user): TransformedUser => ({
          ...user,
          id: user._id,
          avatar: transformImage(user.avatar?.url || user.gooleavatar, 50),
          friends: user.friends?.length || 0,
          groups: user.groups?.length || 0,
        })
      );
      setRows(transformed);
    }
  }, [data]);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
          backgroundColor: "#F7F7F7",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <AdminLoader />
          </Box>
        ) : (
          <>
            <Typography
              textAlign={"center"}
              variant="h4"
              sx={{
                margin: "2rem",
                textTransform: "uppercase",
              }}
            >
              User Management
            </Typography>
            <TableContainer sx={{ maxHeight: "72vh" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          minWidth: column.width,
                          backgroundColor: "black",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {column.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover tabIndex={-1} key={row._id}>
                        {columns.map((column, index) => {
                          const value = row[column.field];

                          return (
                            <TableCell key={index}>
                              {column.renderCell
                                ? column.renderCell({ row })
                                : column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </>
  );
};

export default UserManagement;
