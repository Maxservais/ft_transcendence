import { Autocomplete } from "@mui/material";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserDto } from "../../api/dto/user.dto";
import { UserAPI } from "../../api/user.api";
import RouteProtect from "../auth/RouteProtect";
import { WhiteBorderTextField } from "../utils/WhiteBorderTextField";

const SearchFriendInput = () => {

    const navigate: NavigateFunction = useNavigate();

    const [users, setUsers] = React.useState<UserDto[] | null>(null);

    React.useEffect(() => {
        const fetchUsers = async() => {
            const resp: UserDto[] = await UserAPI.getAllUsers();
            setUsers(resp);
        }

        fetchUsers();
    }, []);

    const keyPress = (event: any): void => {
        if (event.keyCode === 13)
        {
            const user = users?.find(x => x.name === event.target.value);
            if (user) {
                navigate(`/profile/${user.id}`, { replace: true });
            }
        }
    }

    return (
        <RouteProtect>
            <Autocomplete
                sx={{  width:180 }}
                disableClearable
                freeSolo
                options={users? users.map(x => x.name) : []}
                renderInput={(params) => (
                    <>
                    <WhiteBorderTextField
                        {...params}
                        onKeyDown={keyPress}
                        label="Search for friends !"
                        InputProps={{
                            ...params.InputProps,
                        }}
                    />
                    </>
                )}
            />
        </RouteProtect>
        );
    };

export default SearchFriendInput;