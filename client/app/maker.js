const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
      handleError("RAWR! Name and age are required");
      return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"),$("#domoForm").serialize(),function() {
      loadDomosFromServer();
    });
    
    return false;
  };
  
  
  const handleUpdate = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    sendAjax('POST', $("#updateForm").attr("action"),$("#updateForm").serialize(),function() {
      getToken(generateDomoForm,{});
      loadDomosFromServer();
    });
    
    return false;
  };
  
  
  const DomoForm = (props) => {
    return (
      <form id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="favorite">Likes: </label>
        <input id="fav" type="text" name="favorite" placeholder="unknown"/>
        <label htmlFor="leastFavorite">Dislikes: </label>
        <input id="leastFav" type="text" name="leastFavorite" placeholder="unknown"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
      </form>
    );
  };
  
 
  const UpdateForm = (props) => {
    const domo = props.domo;
    return (
      <form id="updateForm"
        onSubmit={handleUpdate}
        name="updateForm"
        action="/updateDomo"
        method="POST"
        className="domoForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder={domo.name}/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder={domo.age}/>
        <label htmlFor="favorite">Likes: </label>
        <input id="fav" type="text" name="favorite" placeholder={domo.favorite}/>
        <label htmlFor="leastFavorite">Dislikes: </label>
        <input id="leastFav" type="text" name="leastFavorite" placeholder={domo.leastFavorite}/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="hidden" name="_id" value={domo._id} />
        <input className="makeDomoSubmit" type="submit" value="Save Domo"/>
        <input className="makeDomoSubmit" type="button" id="cancelEdit" value="Cancel"/>
      </form>
    );
  };
  
  
  const DomoList = function(props) {
    if(props.domos.length === 0){
      return (
        <div className="domolist">
          <h3 className="emptyDomo">No Domos yet</h3>
        </div>
      );
    }
    
    const domoNodes = props.domos.map(function(domo) {
      
      const setForm = (e) => {
        e.preventDefault();
        
        getToken(generateUpdateForm,{ domo: domo});
        return false;
      };
      return (
        <div key={domo._id} className="domo">
          <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
          <h3 className="domoName"> Name: {domo.name}</h3>
          <h3 className="domoAge"> Age: {domo.age}</h3>
          <h4>Favorite: {domo.favorite}</h4>
          <h4>Least Favorite: {domo.leastFavorite}</h4>
          <a className="editButton" href="" onClick={setForm}>Edit</a>
        </div>
      );
    });
    
    return (
      <div id="domoList">
        {domoNodes}
      </div>
    );
  };
  
  // Ajax request to get a list of Domos from the server
  const loadDomosFromServer = () => {
    sendAjax('GET','/getDomos',null, (data) => {
      //console.dir(data);
      ReactDOM.render(
        <DomoList domos={data.domos} />, document.querySelector("#domos")
      );
    });
  };
  
  //Renders the DomoForm object
  const generateDomoForm = function(csrf){
    //renders form
    ReactDOM.render(
      <DomoForm csrf={csrf} />,document.querySelector("#makeDomo")
    );
  };
  
  //Renders the UpdateForm object
  const generateUpdateForm = function(csrf,data){
    //renders form
    ReactDOM.render(
      <UpdateForm csrf={csrf} domo={data.domo}/>,document.querySelector("#makeDomo")
    );
    
    document.querySelector("#cancelEdit").addEventListener("click", (e) => {
      e.preventDefault();
      getToken(generateDomoForm,{});
      return false;
    });
  };
  
  // Sets up the maker page
  const setup = function(csrf) {
    //console.log("Setup - maker called");
    generateDomoForm(csrf);
    
    //renders default domo list display
    ReactDOM.render(
      <DomoList domos={[]} />,document.querySelector("#domos")
    );
    
    loadDomosFromServer();
  };
  
  $(document).ready(function() {
    getToken(setup,{});
  });