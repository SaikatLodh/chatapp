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
      padding: { xs: "1rem", sm: "2rem" },
      margin: { xs: "1rem 0", sm: "2rem 0" },
      borderRadius: "1.5rem",
      width: { xs: "100%", sm: "20rem" },
      maxWidth: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matBlack}`,
          width: { xs: "4rem", sm: "5rem" },
          height: { xs: "4rem", sm: "5rem" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography variant="body1">{title}</Typography>
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
      sx={{
        padding: { xs: "1rem", sm: "2rem" },
        margin: { xs: "1rem 0", sm: "2rem 0" },
        borderRadius: "1rem",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "center", sm: "center" }}
        spacing={{ xs: "1rem", sm: "1rem" }}
      >
        <Box>
          <Avatar
            src={user?.avatar?.url}
            alt={user?.name}
            sx={{ width: { xs: 60, sm: 100 }, height: { xs: 60, sm: 100 } }}
          />
        </Box>
        <Box flexGrow={{ xs: 0, sm: 1 }} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography variant="h6">{user?.name}</Typography>
          <Person2Icon />
        </Box>
        <Box flexGrow={{ xs: 0, sm: 1 }} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography variant="h6">{user?.email}</Typography>
          <AlternateEmailIcon />
        </Box>
        <Box flexGrow={{ xs: 0, sm: 1 }} />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
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
              padding: { xs: "1rem", sm: "2rem" },
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography
              margin={"2rem 0"}
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
              variant="h4"
            >
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
