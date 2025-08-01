"use client";
import React from "react";
import { DoughnutChart, LineChart } from "@/charts/Charts";
import { matBlack } from "@/colors/colors";
import { useDashboardStatus } from "@/hooks/react-query/react-hooks/admin/adminHook";
import { RootState } from "@/store/store";
import {
  Group as GroupIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  StackedLineChart,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Person2Icon from "@mui/icons-material/Person2";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
const Widget = ({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number;
  Icon: React.ReactNode;
}) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matBlack}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useDashboardStatus();

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Box>
          <Avatar
            src={user?.avatar?.url}
            alt={user?.name}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <Box flexGrow={1} />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6">{user?.name}</Typography>
          <Person2Icon />
        </Box>
        <Box flexGrow={1} />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="h6">{user?.email}</Typography>
          <AlternateEmailIcon />
        </Box>
        <Box flexGrow={1} />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {moment(user?.createdAt).format("MMM Do YYYY")}
          <CalendarMonthIcon />
        </Box>
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget
        title={"Users" as string}
        value={data?.usersCount as number}
        Icon={<PersonIcon />}
      />
      <Widget
        title={"Chats" as string}
        value={data?.totalChatsCount as number}
        Icon={<GroupIcon />}
      />
      <Widget
        title={"Messages" as string}
        value={data?.messagesCount as number}
        Icon={<MessageIcon />}
      />
    </Stack>
  );

  return (
    <>
      <Container component={"main"}>
        {Appbar}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{
            xs: "center",
            lg: "stretch",
          }}
          sx={{ gap: "2rem" }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>

            <StackedLineChart />
            <LineChart value={data?.messagesChart as number[]} />
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: "1rem ",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              maxWidth: "25rem",
            }}
          >
            <DoughnutChart
              value={[
                (data && data?.totalChatsCount - data?.groupsCount) || 0,
                data?.groupsCount || 0,
              ]}
              labels={["Single Chats", "Group Chats"]}
            />

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>Vs </Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>

        {Widgets}
      </Container>
    </>
  );
};

export default Dashboard;
