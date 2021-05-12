const handleLink = (e) => {
    e.preventDefault();
    
    $("#linkMessage").animate({width:'hide'},350);
    
    if($("#linkName").val() == '' || $("#linkUrl").val() == ''){
      handleError("RAWR! Name and url are required");
      return false;
    }
    
    sendAjax('POST', $("#linkForm").attr("action"),$("#linkForm").serialize(),function() {
      loadLinksFromServer();
    });
    
    return false;
  };
  
  
  const handleUpdate = (e) => {
    e.preventDefault();
    
    $("#LinkMessage").animate({width:'hide'},350);
    
    sendAjax('POST', $("#updateForm").attr("action"),$("#updateForm").serialize(),function() {
      getToken(generateLinkForm,{});
      loadLinksFromServer();
    });
    
    return false;
  };
  
  
  const LinkForm = (props) => {
    return (
      <form id="linkForm"
        onSubmit={handleLink}
        name="linkForm"
        action="/maker"
        method="POST"
        className="linkForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="linkName" type="text" name="name" placeholder="Link Name"/>
        <label htmlFor="url">Url</label>
        <input id="linkUrl" type="text" name="url" placeholder="Link Url"/>
        <label htmlFor="type">Content Type: </label>
        <input id="fav" type="text" name="type" placeholder="unknown"/>        
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeLinkSubmit" type="submit" value="Make Link"/>
      </form>
    );
  };
  
 
  const UpdateForm = (props) => {
    const link = props.link;
    return (
      <form id="updateForm"
        onSubmit={handleUpdate}
        name="updateForm"
        action="/updateLink"
        method="POST"
        className="linkForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="linkName" type="text" name="name" placeholder={link.name}/>
        <label htmlFor="url">Url</label>
        <input id="linkUrl" type="text" name="url" placeholder={link.url}/>
        <label htmlFor="type">Content Type: </label>
        <input id="fav" type="text" name="type" placeholder={link.type}/>        
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input type="hidden" name="_id" value={link._id} />
        <input className="makeLinkSubmit" type="submit" value="Save Link"/>
        <input className="makeLinkSubmit" type="button" id="cancelEdit" value="Cancel"/>
      </form>
    );
  };
  
  
  const LinkList = function(props) {
    if(props.links.length === 0){
      return (
        <div className="linklist">
          <h3 className="emptyLink">No Links yet</h3>
        </div>
      );
    }
    
    const linkNodes = props.links.map(function(link) {
      
      const setForm = (e) => {
        e.preventDefault();
        
        getToken(generateUpdateForm,{ link: link});
        return false;
      };       
     
      return (
        //Bug here
        <div key={link._id} className="link">
          <img src="/assets/img/linkface.jpeg" alt="link face" className="linkFace" />
          <h3 className="linkName"> Name: {link.name}</h3>
          <a className="linkUrl" href="" onClick={link.url}>Url{link.url}</a>
          <h4>Content Type: {link.type}</h4>          
          <a className="editButton" href="" onClick={setForm}>Edit</a>
        </div>
        
      );
    });
    
    return (
      <div id="linkList">
        {linkNodes}
      </div>
    );
  };
  
  // Ajax request to get a list of Links from the server
  const loadLinksFromServer = () => {
    sendAjax('GET','/getLinks',null, (data) => {
      //console.dir(data);
      ReactDOM.render(
        <LinkList links={data.links} />, document.querySelector("#links")
      );
    });
  };
  
  //Renders the LinkForm object
  const generateLinkForm = function(csrf){
    //renders form
    ReactDOM.render(
      <LinkForm csrf={csrf} />,document.querySelector("#makeLink")
    );
  };
  
  //Renders the UpdateForm object
  const generateUpdateForm = function(csrf,data){
    //renders form
    ReactDOM.render(
      <UpdateForm csrf={csrf} link={data.link}/>,document.querySelector("#makeLink")
    );
    
    document.querySelector("#cancelEdit").addEventListener("click", (e) => {
      e.preventDefault();
      getToken(generateLinkForm,{});
      return false;
    });
  };
  
  // Sets up the maker page
  const setup = function(csrf) {
    //console.log("Setup - maker called");
    generateLinkForm(csrf);
    
    //renders default link list display
    ReactDOM.render(
      <LinkList links={[]} />,document.querySelector("#links")
    );
    
    loadLinksFromServer();
  };
  
  $(document).ready(function() {
    getToken(setup,{});
  });