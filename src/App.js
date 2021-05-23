import { useEffect, useState } from "react";
import { FormComp } from "./components/FormComp";
import { Navbar } from "./components/Navbar";

function App() {
  
  const [members, setMembers] = useState();
  
  const getMembers = async () => {
    try {
      const url = 'https://bitacora-app-server.herokuapp.com/members';

      const response = await fetch(url);
      const data = await response.json();
      setMembers(data.data)
  
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getMembers();
    
  }, [])

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <FormComp  members={members} />
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
