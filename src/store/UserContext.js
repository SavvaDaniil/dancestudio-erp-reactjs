import React, {useEffect, useState}  from "react";

const UserContext = React.createContext()

const UserProvider = ({ children, valueUser }) => {
    
  const [user, setUser] = useState(valueUser);

  useEffect(() => {
    //console.log("useEffect");
    //console.log(valueUser);
  });

  // Login updates the user data with a name parameter
  const login = (name) => {
    setUser((user) => ({
      isAuthed: true,
    }));
  };

  // Logout updates the user data to default
  const logout = () => {
    setUser((user) => ({
      isAuthed: false,
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}


export { UserProvider }
//export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;


export default UserContext;