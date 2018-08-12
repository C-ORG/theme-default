const inquirer    = require('inquirer');

module.exports = {

  askOrganisationName: () => {
    const questions = [
      {
        name: 'name',
        type: 'input',
        message: 'Enter your organization name:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter organization name.';
          }
        }
      },
      {
        name: 'address',
        type: 'input',
        message: 'Enter your blockchain address:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a blockchain address.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },


  askParameters: () => {
    const questions = [
      {
        name: 'slope',
        type: 'input',
        message: 'Enter the buying curve slope:',
        default: 1,
        validate: function( value ) {
          value = parseFloat(value);
          if (!isNaN(value)) {
            return true;
          } else {
            return 'It has to be a number.';
          }
        }
      },
      {
        name: 'alpha',
        type: 'input',
        message: 'Enter the coefficient of investors for selling reserve (alpha):',
        default: 0.1,
        validate: function(value) {
          value = parseFloat(value);
          if (!isNaN(value)) {
            return true;
          } else {
            return 'It has to be a number.';
          }
        }
      },
      {
        name: 'beta',
        type: 'input',
        message: 'Enter the coefficient of revenues for selling reserve (beta):',
        default: 0.3,
        validate: function(value) {
          value = parseFloat(value);
          if (!isNaN(value)) {
            return true;
          } else {
            return 'It has to be a number.';
          }
        }
      },
      {
        name: 'gamma',
        type: 'input',
        message: 'Enter the coefficient for taxing reserve (gamma):',
        default: 0.1,
        validate: function(value) {
          value = parseFloat(value);
          if (!isNaN(value)) {
            return true;
          } else {
            return 'It has to be a number.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  }

};
