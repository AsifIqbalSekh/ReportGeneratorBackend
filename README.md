*This branch focuses on backend*
*Use camelCase for naming files and variables*
# ARGS
Audiogram Report Generation Software


# Project Structure
Rough structure of the project, subject to change.

## Backend
1. Auth API
   * [x] Login Audiologist
   * [x] Register Audiologist
2. Database API
   * [ ] Add/Edit/Get Audiologist creds
   * [ ] Add/Edit/Get a patient profile
   * [x] Add/Edit/Get audiogram to a patient profile
   * [ ] Count per Doctor's refs


## Extra info
### patientId structure
patientId = [Initials of login user in cap][DDMMYYYY][# of patient that day]

Eg. PS121020201

### chart data post

Due to problems parsing arrays from json body in the express, the chart data is converted into strings to POST and store in mongoDB.

Format: "','joined array*','joined array"

Eg. [[ 1,2 ][ 3,4 ]] becomes "1,2*3,4"