
const { removeAllListeners } = require('../models/user-model');
const User = require('../models/user-model');

let sckUsersOnline = [];
let duplicateUsers = [];
let user = {};
onlineUserData = {};
// let globUID = '';


module.exports.genericSocket = (socket, io) => {

    // =========================================  INITIAL CONNECTION - COMMON FOR ALL ==================================== //

    // this info comes from the database, passed to socket, then here...
    const usrname = socket.handshake.query.usr.replace(/['"]+/g, ''); // get the username - the actual username from database
    const uid = socket.handshake.query.id.replace(/['"]+/g, ''); // set an id - it is the respective document _id of user
    globUID = uid; // ...make it available throughout
    
    
    User.getUserByUid(globUID, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                //console.log(user);
                onlineUserData = {
                  onlineuser: user.fullname,
                  id: user.id,
                  rank: user.userstatistics.role,
                  avatar: user.misc.avatar
                }   
              //io.of('/admin').emit('infoForAdmin', odata);
              //console.log(onlineUserData);

              // Create an object to hold user data for sockets >>>>
              user = {
              name: usrname,
              userid: uid,
              sckid: socket.id,
              rank: onlineUserData.rank,
              avatar: onlineUserData.avatar
              }

              // The - user exists in main array - function 
              userExists = (id) => {
                return sckUsersOnline.some( (key) => {
                return key.userid === id;
                });
              };

              // If user exists in main array...
              if (userExists(uid)) {
                duplicateUsers.push(user); // Exists! Push in duplicates!
                socket.join(uid); // join user unique room eitherwise
             // - existing or not - to handle multiple tabs
             } else {
               sckUsersOnline.push(user); // New connection, push in main array
               socket.join(uid); // each user joins a room with id the _id of 
              // his respective document in users database
              }

             console.log('onlogin/what i need:');
             console.table(sckUsersOnline);
             //console.log('onlogin/duplicates:');
             //console.table(duplicateUsers);
             let adminlist = sckUsersOnline.map(user => {
                let users = {
                    name: user.name,
                    userid: user.userid,
                    role: user.rank,
                    avatar: user.avatar
                }
                return users;
             });
             console.log('login-list for admin',adminlist);
             const data = {
               activesno: adminlist.length,
               actives:adminlist
             }
             console.log('login-data fo ui', data);
             io.of('/admin').emit('infoForAdmin', data);
            }
        
        }
        
    });

    

    
    
    
    // =================================================================================================================== //

    // ======================== GENERAL DISCONNECTION FOR ONE OR MULTI TAB - COMMON FOR ALL ============================== //
    socket.on('terminateAllTabs', () => {
        io.sockets.in(uid).emit('terminateAllTabs', 'terminate due to alter ego kill');
        io.in(uid).disconnectSockets(true);
        let adminlist = sckUsersOnline.map(user => {
            let users = {
                name: user.name,
                userid: user.userid,
                role: user.rank,
                avatar: user.avatar
            }
            return users;
        });
        console.log('termination-list for admin',adminlist);
        const data = {
          activesno: adminlist.length,
          actives:adminlist
        }
        console.log('termination-data fo ui', data);
        io.of('/admin').emit('infoForAdmin', data);
    });
    // =================================================================================================================== //

    // ================== DISCONNECTION FOR BROWSER CLOSE - COMMON FOR ALL - AND CALLED FROM ABOVE ======================= //
    socket.on('disconnect', () => {

        // Check if socket id exists in any array
        idExists = (id, arr) => {
            return arr.some( (key) => {
                return key.userid === id;
            });
        };

        // Find the index of a specific socket id  in any array
        idIndex = (id, arr) => {
            return arr.findIndex( (key) => {
                return key.userid === id;
            });
        };

        // Check if UID exists in any array
        usrUIDExistsInDupl = (id, arr) => {
            return arr.some ((key) => {
                return key.userid === id;
            });
        };

        // console.log('hasLeft:', user.userid);

        // If user exists in duplicate array but not in main
        // delete only the duplicate user - leave main array
        // always populated
        if (usrUIDExistsInDupl(uid, duplicateUsers)) {
            duplicateUsers.splice(idIndex(uid, duplicateUsers), 1);
            //console.log('after left/what i need:');
            //console.table(sckUsersOnline);
            //console.log('after left/duplicates:');
            //console.table(duplicateUsers);
        } else {
            sckUsersOnline.splice(idIndex(uid, sckUsersOnline), 1);
            //console.log('after left/what i need:');
            //console.table(sckUsersOnline);
            //console.log('after left/duplicates:');
            //console.table(duplicateUsers);
        }
    });
    // =================================================================================================================== //
}

module.exports.adminSocket = (socket,io) => {
  // console.log('admin connected');
  let adminlist = sckUsersOnline.map(user => {
      let users = {
          name: user.name,
          userid: user.userid,
          role: user.rank,
          avatar: user.avatar
      }
      return users;
  });

  
  
  console.log('list for admin',adminlist);
  const data = {
    activesno: adminlist.length,
    actives:adminlist
  }
  console.log('data fo ui', data);
  io.of('/admin').emit('infoForAdmin', data);
  /*
  User.getUserByUid(globUID, (err, user) => {
      if (err) {
          console.log(err);
      } else {
          if (user) {
              //console.log(user);
              const data = {
                activesno: sckUsersOnline.length,
                actives: sckUsersOnline,
                role: user.userstatistics.role
            }
            io.of('/admin').emit('infoForAdmin', data);
            console.log(data);
          }
      }
  });
  */
}



