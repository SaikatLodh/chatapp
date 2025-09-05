"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
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
import { useGetAllChats } from "@/hooks/react-query/react-hooks/admin/adminHook";
import { AdminChats } from "@/type";
import AdminLoader from "../account/AdminLoader";

interface TransformedChat
  extends Omit<AdminChats, "avatar" | "members" | "creator"> {
  id: string;
  avatar: string;
  members: string[];
  creator: {
    name: string;
    avatar: string;
  };
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
    responsiveSx: { display: { xs: 'none', md: 'table-cell' } },
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 100,
    renderCell: (params: { row: TransformedChat }) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "groupChat",
    headerName: "Group",
    width: 100,
    renderCell: (params: { row: TransformedChat }) =>
      params.row.groupChat ? "Yes" : "No",
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    width: 300,
    responsiveSx: { display: { xs: 'none', md: 'table-cell' } },
    renderCell: (params: { row: TransformedChat }) => (
      <Stack direction="row" spacing={1}>
        {params.row.members.map((url, index) => (
          <Avatar key={index} src={url} alt={`Member ${index}`} />
        ))}
      </Stack>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    width: 150,
    responsiveSx: { display: { xs: 'none', md: 'table-cell' } },
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 250,
    responsiveSx: { display: { xs: 'none', md: 'table-cell' } },
    renderCell: (params: { row: TransformedChat }) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const { data, isLoading } = useGetAllChats();
  const [rows, setRows] = useState<TransformedChat[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      const transformed: TransformedChat[] = data.map((chat: AdminChats) => ({
        ...chat,
        id: chat._id,
        avatar: transformImage(chat.avatar[0] || "", 50),
        members: chat.members.map((m) => transformImage(m.avatar, 50)),
        creator: {
          name: chat.creator.name,
          avatar: transformImage(chat.creator.avatar, 50),
        },
      }));
      setRows(transformed);
    }
  }, [data]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: "0.5rem 1rem", md: "1rem 4rem" },
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
            textAlign="center"
            variant="h4"
            sx={{
              margin: { xs: "1rem", md: "2rem" },
              fontSize: { xs: "1.5rem", md: "2.25rem" },
              textTransform: "uppercase",
            }}
          >
            Chat Management
          </Typography>

          <TableContainer sx={{ maxHeight: "72vh", overflowX: 'auto' }}>
            <Table stickyHeader aria-label="chat table">
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
                        ...column.responsiveSx,
                      }}
                      align={
                        column.field === "totalMembers"
                          ? "center"
                          : column.field === "totalMessages"
                          ? "center"
                          : column.field === "name"
                          ? "center"
                          : column.field === "groupChat"
                          ? "center"
                          : "left"
                      }
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
                    <TableRow hover tabIndex={-1} key={row.id}>
                      {columns.map((column, index) => {
                        const cellContent =
                          "renderCell" in column && column.renderCell
                            ? column.renderCell({ row })
                            : typeof row[
                                column.field as keyof TransformedChat
                              ] === "object"
                            ? JSON.stringify(
                                row[column.field as keyof TransformedChat]
                              )
                            : (row[column.field as keyof TransformedChat] as
                                | string
                                | number
                                | boolean
                                | undefined);

                        return (
                          <TableCell
                            key={index}
                            sx={{
                              textAlign: `${
                                column.field === "totalMembers"
                                  ? "center"
                                  : column.field === "totalMessages"
                                  ? "center"
                                  : column.field === "name"
                                  ? "center"
                                  : column.field === "groupChat"
                                  ? "center"
                                  : "left"
                              }`,
                              ...column.responsiveSx,
                            }}
                          >
                            {cellContent}
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
  );
};

export default ChatManagement;
