var usersById = [];
usersById[0] = {id:0,prenom: 'jean', nom: 'paul',ville:'paris',societe:'',poste:''};
usersById[1] = {id:1,prenom: 'jean', nom: 'range',ville:'lyon'};
usersById[2] = {id:2,prenom: 'paul', nom: 'palu',ville:'lyon'};
usersById[3] = {id:3,prenom: 'jean paul', nom: 'barto',ville:'lyon'};
usersById[4] = {id:4,prenom: 'thibaud', nom: 'granier',ville:'lyon'};
usersById[5] = {id:5,prenom: 'jack', nom: 'pariche',ville:'paris',societe:'',poste:''};
usersById[6] = {id:6,prenom: 'jimmy', nom: 'bilou',ville:'paris',societe:'',poste:''};

$(function() {
    $("#addUser").click(function(){
    $("#addUser").hide()
    $("#addUser").after('<input id="acUser" type="text" class="form-control acInput" id="acUser" placeholder="User">')
    $("#acUser").focus()
        var myAcUser = new acUser("#acUser",usersById);
        myAcUser.init()
  });
});

function acUser(field,data){
    this.field = $(field)
  this.usersById = data;
  this.selectedItem = -1;
  this.searchArray = []
  this.search = ""
  this.result = [];
}

acUser.prototype = {
    init : function(){
    var self = this
    this.field.after("<div class='ac'></div>")
    this.field.keyup(function( e ) {
      if ( e.which == 38 ) {
        e.preventDefault()
        self.prev()
      }else if(e.which == 40){
        e.preventDefault()
        self.next()
          }else if(e.which == 13){
        self.sendId()
        self.close()
      }else{
        self.searchUser()
      }
    });
    this.field.blur(function() {
            self.close()
    });
  },
  
    searchUser: function(){
    var self = this
    var html = ""
    this.search = this.field.val();
    if(this.search!=""){
    // Find matching user id
      this.usersById.forEach(function(user) {
        self.searchArray = self.search.split(' ');
        var wordsFind = 0
        var words = 0
        self.searchArray.forEach(function(strSearch){
          var nbMach = 0;
          if(strSearch!=""){
            words ++
            nbMach += self.searchWeight(user,user.nom,1,true,strSearch)
            nbMach += self.searchWeight(user,user.nom,1,false,strSearch)
            nbMach += self.searchWeight(user,user.prenom,1,true,strSearch)
            nbMach += self.searchWeight(user,user.prenom,1,false,strSearch)
            nbMach += self.searchWeight(user,user.ville,1,true,strSearch)
            nbMach += self.searchWeight(user,user.ville,1,false,strSearch)
            if(nbMach>0){
              wordsFind++
            } 
          }
         })
         if(wordsFind != words){
            delete self.result[user.id]
         }
      });
      this.result.forEach(function(user) {
        html += "<li class='row' idUser='" + user.id 
        html += "' ><div class='user'></div><div class='userName'>" 
        html += self.boldStrFind(user.prenom).toLowerCase() + " " 
        html += self.boldStrFind(user.nom).toUpperCase() + "</div><div class='city'>"
        html += self.boldStrFind(user.ville).toLowerCase()+"</div></li>";
      })
        }
    var listAc = this.field.next(".ac")
    listAc.html("<ul>" + html + "</ul>")
    var itemAc = listAc.find("li")
    itemAc.mousedown(function() {
      self.sendId()
    })
    itemAc.hover(function() {
      self.selectItem($(this).attr("idUser"))
    })
  },
  
  boldStrFind: function(str){
    var html = str
    this.searchArray.forEach(function(strSearch){
    if(strSearch!=""){
      html = html.replace(new RegExp(strSearch,'gi'), "<b>" + strSearch + "</b>" );
      }
    })
    return html
  },
  
  searchWeight: function(user,param,weight,exact,strSearch){
    if(exact){
      strSearch = '^' + strSearch + '$'
    }
    if(param.search(new RegExp(strSearch,'i')) != -1){
      if(!this.result[user.id]){
        user.weight = 0
        this.result[user.id] = user
      }
      this.result[user.id].weight += weight
      return 1;
    }
    return 0;
  },
  
  selectItem: function(id){
    $(".ac ul>li.selected").removeClass("selected")
    $(".ac ul>li[idUser=" + id + "]").addClass("selected")
    this.selectedItem = id
  },
  
  next: function(){
    var self = this
    var firstItem = -1;
    var item = -1;
    this.result.forEach(function(user,i) {
      if(firstItem == -1){
        firstItem = i
      }
      if(item==-2){
        item = i
      }
        if(self.selectedItem == user.id){
        item = -2
      }
    })
    if(item<0){
        item = firstItem
    }
    this.selectItem(this.result[item].id)
  },
  
  prev: function(){
    var self = this
    var item = -1;
    this.result.forEach(function(user,i) {
        if(self.selectedItem == user.id){
        item = prevItem
      }
      prevItem = i
    })
    if(item == -1){
        item = prevItem
    }
    this.selectItem(this.result[item].id)
  },
  
  sendId: function()
  {
    alert(this.selectedItem)
  },
  
  close: function()
  {
    this.field.val("")
    this.field.next(".ac").remove()
    this.selectedItem = -1
    $("#addUser").show()
    this.field.remove()
  }
}