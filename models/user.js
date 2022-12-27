class User {
    constructor(email, password,pseudo,skills,portfolio,num,longitude,latitude) {
      this.email = email;
      this.password = password;
      this.pseudo = pseudo;
      this.skills = skills;
      this.portfolio = portfolio;
      this.num = num;
      this.longitude=longitude;
      this.latitude=latitude;
      
    }
  }
  
  module.exports = { User };
  