const link = "https://thawing-wildwood-69422.herokuapp.com/"; //heroku link for the TEAMS-API

/* View Model with empty array properties */
let viewModel ={
    teams: ko.observable([]),
    employees: ko.observable([]),
    projects: ko.observable([])
};

function showGenericModal(title,messgae){
    $(".modal-body").empty();
    $(".modal-title").text(title); // setting the modal title
    $(".modal-body").append(messgae); // setting the modal body

    $('#genericModal').modal({ // show the modal programmatically
        backdrop: 'static', // disable clicking on the backdrop to close
        keyboard: false // disable using the keyboard to close
    });
}


function initializeTeams(){
    return new Promise((resolve,reject) =>{
       $.ajax({
        url: link + "teams-raw",
        type: "GET",
        contentType: "application/json"
       })
       .done(function(data){
        viewModel.teams = ko.mapping.fromJS(data); // populating the teams property of the View Model
        resolve();
       })
       .fail(function(reason){
           reject("Error loading the team data."); // if ajax call fails promise rejected
       });
    })
}

function initializeEmployees(){
    return new Promise((resolve,reject) =>{
       $.ajax({
        url: link + "employees",
        type: "GET",
        contentType: "application/json"
       })
       .done(function(data){
        viewModel.employees = ko.mapping.fromJS(data); // populating the employees property of the View Model
        resolve();
       })
       .fail(function(reason){
           reject("Error loading the team data."); // if ajax call fails promise rejected
       });
    })
}

function initializeProjects(){
    return new Promise((resolve,reject) =>{
       $.ajax({
        url: link + "projects",
        type: "GET",
        contentType: "application/json"
       })
       .done(function(data){
        viewModel.projects = ko.mapping.fromJS(data); // populating the projects property of the View Model
        resolve();
       })
       .fail(function(reason){
           reject("Error loading the team data."); // if ajax call fails promise rejected
       });
    })
}

$(document).ready(function () {
    
     initializeTeams()
    .then(initializeEmployees)
    .then(initializeProjects).then(function(){
        ko.applyBindings(viewModel); // applying bindings to the "data-bind" for the whole document

        $("select.multiple").multipleSelect({ filter: true });
        $("select.single").multipleSelect({ single: true, filter: true });
        console.log(ko.mapping.toJS(viewModel));  //DE-BUGGING REASONS
    })
    .catch(function(reason){
        showGenericModal("Error" , reason); //invoking the modal to display the error
    });

    
    
});

function saveTeam(){
    var currentTeam = this; //this -> in the context of this function will be a single observable "team" from viewModel.teams
    var teamId = currentTeam._id();  //invoking the observable team id of the viewmodel
    
    $.ajax({
        url: link + "team/" + teamId,
        type: "PUT",
        data: JSON.stringify({
            Projects: currentTeam.Projects(),
            Employees: currentTeam.Employees(),
            TeamLead: currentTeam.TeamLead()
        }),
        contentType: "application/json"
    })
    .done(function(){
        showGenericModal("Success" , currentTeam.TeamName() + " has been updated successfully");
    })
    .fail(function(err){
        showGenericModal("Error" , "Error updating the team information"); //invoking the modal to display the error
    })

}



