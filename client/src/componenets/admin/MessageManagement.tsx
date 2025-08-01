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
import { useGetMessages } from "@/hooks/react-query/react-hooks/admin/adminHook";
import { AdminChatMessage } from "@/type";
import moment from "moment";
import AdminLoader from "../account/AdminLoader";

interface TransformedMessage extends AdminChatMessage {
  id: string;
  transformedSender: {
    name: string;
    avatar: string;
  };
  createdDate: string;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
  },
  {
    field: "transformedSender",
    headerName: "Sender",
    width: 250,
    renderCell: (params: { row: TransformedMessage }) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          src={params.row.transformedSender.avatar}
          alt={params.row.transformedSender.name}
        />
        <span>{params.row.transformedSender.name}</span>
      </Stack>
    ),
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    width: 120,
    renderCell: (params: { row: TransformedMessage }) =>
      params.row.groupChat ? "Yes" : "No",
  },
  {
    field: "createdDate",
    headerName: "Created At",
    width: 220,
  },
  {
    field: "message",
    headerName: "Message",
    width: 200,
    renderCell: (params: { row: TransformedMessage }) => (
      <Stack direction="row" spacing={1}>
        {params.row.attachments.map((file, index) => {
          const image =
            file.url.endsWith(".jpg") ||
            file.url.endsWith(".png") ||
            file.url.endsWith(".jpeg") ||
            file.url.endsWith(".gif");

          const video =
            file.url.endsWith(".mp4") ||
            file.url.endsWith(".webm") ||
            file.url.endsWith(".ogg");

          const audio =
            file.url.endsWith(".mp3") ||
            file.url.endsWith(".wav") ||
            file.url.endsWith(".ogg") ||
            file.url.endsWith(".mpeg");

          const pdf = file.url.endsWith(".pdf");
          return (
            <>
              <Box key={index}>
                {image && (
                  <Box
                    component={"img"}
                    src={file.url}
                    sx={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
                {video && (
                  <Box
                    component={"video"}
                    src={file.url}
                    sx={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    controls
                  />
                )}
                {audio && (
                  <audio
                    src={file.url}
                    controls
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  ></audio>
                )}
                {pdf && (
                  <a href={file.url} target="_blank">
                    <embed
                      src={file.url}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      type="application/pdf"
                    ></embed>
                  </a>
                )}
              </Box>
            </>
          );
        })}
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const { data, isLoading } = useGetMessages();
  const [rows, setRows] = useState<TransformedMessage[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (data) {
      setRows(
        data.map((msg: AdminChatMessage) => ({
          ...msg,
          id: msg._id,
          transformedSender: {
            name: msg.sender.name,
            avatar: transformImage(msg.sender.avatar, 50),
          },
          createdDate: moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
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
            textAlign="center"
            variant="h4"
            sx={{ margin: "2rem", textTransform: "uppercase" }}
          >
            Message Management
          </Typography>

          <TableContainer sx={{ maxHeight: "72vh" }}>
            <Table stickyHeader>
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
                      align={column.field === "message" ? "left" : "center"}
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
                    <TableRow hover key={row.id}>
                      {columns.map((column, index) => {
                        const cellContent =
                          "renderCell" in column && column.renderCell
                            ? column.renderCell({ row })
                            : (row[column.field as keyof TransformedMessage] as
                                | string
                                | number
                                | boolean
                                | undefined);

                        return (
                          <TableCell key={index} align="center">
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
