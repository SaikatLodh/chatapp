import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React from "react";
import DoneIcon from '@mui/icons-material/Done';
import RemoveIcon from "@mui/icons-material/Remove";

const MembersList = ({
    data,
    friends,
    addMembers,
}: {
    data: {
        _id: string;
        name: string;
        avatar?:
        | {
            url: string;
            public_id: string;
        }
        | undefined;
        gooleavatar?: string | undefined;
    };
    friends: string[];
    addMembers: (friendId: string) => void;
}) => {
    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}

            >
                <Avatar
                    src={
                        (data.avatar && data.avatar?.url) ||
                        (data.gooleavatar && data.gooleavatar)
                    }
                />

                <Typography
                    variant="body1"
                    sx={{
                        flexGlow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                >
                    {data.name}
                </Typography>

                <IconButton size="small" onClick={() => addMembers(data._id)}>
                    {friends.includes(data._id) ? <DoneIcon /> : <RemoveIcon />}
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default MembersList
