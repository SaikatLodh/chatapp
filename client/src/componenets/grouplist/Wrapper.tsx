import { Box } from "@mui/material";
import RightMainWrapper from "./right/RightMainWrapper";
import { useGroupList } from "@/hooks/react-query/react-hooks/chat/chatHook";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import InitialMessage from "../home/message/InitialMessage";

const Wrapper = () => {
  const { groupData } = useSelector((state: RootState) => state.chat);
  const { data: group } = useGroupList();
  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          width: { sm: group && group?.length > 0 ? "60%" : "80%", xs: "100%" },
        }}
      >
        {groupData ? (
          <RightMainWrapper groupData={groupData} />
        ) : (
          <InitialMessage />
        )}
      </Box>
    </>
  );
};

export default Wrapper;
