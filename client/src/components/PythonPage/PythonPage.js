import React from "react";
import axios from "axios";

function  PythonPage() {

    const formSubmit = (event) => {
        event.preventDefault();
        axios.get('http://localhost:3001/python')
            .then(response => { console.log(response.data);
                return response.data})
    }

    return(
        <>
            <div>hello</div>
            <button onClick={formSubmit}>submit</button>
        </>
    )
}

export default PythonPage;