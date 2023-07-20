import { createSlice } from '@reduxjs/toolkit';

export type AuthUser = {
    userId?: string,
    userEmail?: string,
    userPassword?: string,
    confirmPassword?: string,
  };
  export interface User extends AuthUser {
    firstName: string,
    lastName: string,
    parent: string,
    street: string,
    zipCode: string,
    city: string,
    telephoneNumber: string,
    houseNumber: string,
    status?: string,
    stored?: string,
    notes?: string,
  }

// export const signUp = createAsyncThunk('user/signUp', async (data: User) => {
//   const { userEmail, userPassword, firstName, lastName, parent, street, houseNumber, zipCode, city, telephoneNumber, kids, notes} = data;
//   const userCredential = await createUserWithEmailAndPassword(firebaseAuth, userEmail!, userPassword!);
//   const { uid } = userCredential.user;
//   const stringifiedkids = JSON.stringify(kids)
//   try {
//    await setDoc(doc(db, 'users', uid), {
//       firstName: firstName,
//       lastName: lastName,
//       parent: parent,
//       street: street,
//       houseNumber: houseNumber,
//       zipCode: zipCode,
//       userEmail: userEmail,
//       city: city,
//       telephoneNumber: telephoneNumber,
//       kids: stringifiedkids,
//       notes: notes,
//   })
//   } catch (error) {
//   console.log(error);
// }
// });

// export const updateUser = createAsyncThunk('user/updateUser', async (data: User) => {
//   if (!data.userId) {
//     throw new Error('Invalid userId');
//   }
//   const docRef = doc(db, 'users', data.userId);
//   const stringifiedkids = JSON.stringify(data.kids)

//     await setDoc(docRef, { 
//     firstName: data.firstName,
//     lastName: data.lastName,
//     parent: data.parent,
//     street: data.street,
//     houseNumber: data.houseNumber,
//     zipCode: data.zipCode,
//     city: data.city,
//     telephoneNumber: data.telephoneNumber,
//     kids: stringifiedkids,
//     notes: data.notes,
//   }, );


// export const signIn = createAsyncThunk('user/signIn', async (data: AuthUser) => {
//   const { userEmail, userPassword } = data;
//   const userCredential = await signInWithEmailAndPassword(firebaseAuth, userEmail!, userPassword!);

//   const { uid, email, displayName } = userCredential.user;

//   return { uid, email, displayName };
// });

const emptyUserState = { 
  userId: "empty", 
  firstName: "empty",
  lastName: "empty", 
  userEmail: "empty", 
  street: "empty",
  houseNumber: "empty",
  status: "logged-out",
  stored: ""
} as User;

const userSlice = createSlice({
  name: 'user',
  initialState: emptyUserState,
  reducers: {
    setUser: (state: User, { payload }): User => {
      return {
        ...state,
      firstName: payload.firstName,
      lastName: payload.lastName,
      parent: payload.parent,
      street: payload.street,
      houseNumber: payload.houseNumber,
      zipCode: payload.zipCode,
      city: payload.city,
      telephoneNumber: payload.telephoneNumber,
      notes: payload.notes,
    }
  },
    logout: () => {
      return emptyUserState;
    },
  },
});

//   extraReducers: (builder) => {
//     builder
//       .addCase(signUp.pending, (state) => {
//         state.stored = 'loading';
//       })
//       .addCase(signUp.fulfilled, (state) => {
//         state.stored = 'user subscribed';
//       })
//       .addCase(signUp.rejected, (state) => {
//         state.stored = 'failed';
//       })
//       .addCase(signIn.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(signIn.fulfilled as any, (state, { payload }) => {
//         state.userId = payload.uid;
//         state.userEmail = payload.email;
//         state.status = 'logged-in';
//       })
//       .addCase(signIn.rejected, (state) => {
//         state.status = 'failed';
//       })
//       .addCase(updateUser.pending, (state) => {
//         state.stored = 'loading';
//       })
//       .addCase(updateUser.fulfilled, (state) => {
//         state.stored = 'user updated';
//       })
//       .addCase(updateUser.rejected, (state) => {
//         state.stored = 'failed';
//       });
//   },
// });
 

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;