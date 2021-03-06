import axios from 'axios';
import { setAlert } from './alert';
import {
    GATHERING_ERROR,
    GET_GATHERING,
    CLEAR_GATHERING,
    UPDATE_GATHERING,
    CLEAR_GROUPS,
    GET_GROUPS,
    SET_GROUPS,
    CLEAR_MEETING,
    SET_MEETING,
    MEETING_ERROR,
} from './types';

// Get gathering
// MODIFIED FOR MEETER5
export const getGathering = (id, cid) => async (dispatch) => {
    //ensure that id is not null, if so return
    let meetingId = id;
    let clientId = cid;
    // console.log('getGathering:IN');
    if (meetingId.length < 1) return;
    if (meetingId === 0) return;
    try {
        //=====================================
        // get the meeting by ID for client

        dispatch({ type: CLEAR_MEETING });
        const config = {
            headers: {
                'Access-Control-Allow-Headers':
                    'Content-Type, x-auth-token, Access-Control-Allow-Headers',
                'Content-Type': 'application/json',
            },
        };
        let obj = {
            operation: 'getMeetingByIdAndClient',
            payload: {
                id: meetingId,
                clientId: clientId,
            },
        };
        let body = JSON.stringify(obj);

        let api2use = process.env.REACT_APP_MEETER_API + '/meetings';
        let res = await axios.post(api2use, body, config);

        dispatch({
            type: SET_MEETING,
            payload: res.data.body,
        });
        //=============================================
        // now get any groups associated with meeting
        //=============================================
        dispatch({ type: CLEAR_GROUPS });
        let groupQuery = {
            operation: 'getGroupsByMeetingId',
            payload: {
                meetingId: meetingId,
            },
        };
        body = JSON.stringify(groupQuery);
        api2use = process.env.REACT_APP_MEETER_API + '/groups';
        res = await axios.post(api2use, body, config);
        if (res.data.status === '200') {
            dispatch({
                type: SET_GROUPS,
                payload: res.data.body,
            });
        }
    } catch (err) {
        dispatch({
            type: MEETING_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }

    //endure that id is not null, if so return

    // // console.log('getGathering:IN');
    // if (id.length < 1) return;
    // if (id === 0) return;
    // try {
    //     dispatch({ type: CLEAR_GATHERING });
    //     const res = await axios.get(`/api/meeting/${id}`);

    //     dispatch({
    //         type: GET_GATHERING,
    //         payload: res.data,
    //     });
    //     await axios.get(`/api/meeting/${id}`);
    //     // console.log('res.data [AFTER]' + res.data);
    // } catch (err) {
    //     dispatch({
    //         type: GATHERING_ERROR,
    //         payload: {
    //             msg: err.response.statusText,
    //             status: err.response.status,
    //         },
    //     });
    // }
};
// MODIFIED FOR MEETER5
export const addDefaultGroups = (grps2add) => async (dispatch) => {
    console.log('in actions/gatherings :: addDefaultGroups');
    console.log('typeof grps2add: ' + typeof grps2add);
    const util = require('util');
    console.log(
        'defaultGroups: ' +
            util.inspect(grps2add, { showHidden: false, depth: null })
    );

    // going to need the meeting id. We will grab while rotating through...
    let mid = null;
    // let axiosResponse = null;
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const newGroups = [];
        let result = grps2add.map((g) => {
            newGroups.push(g);
            mid = g.mid;
        });
        for (let i = 0; i < newGroups.length; i++) {
            const axiosResponse = await axios.post(
                '/api/groups/group/0',
                newGroups[i],
                config
            );
        }

        console.table(newGroups[0]);

        // for (let i = 0; i < newGroups.length; i++) {
        //     const axiosResponse = await axios.put(
        //         '/api/client/defaultgroup',
        //         newGroups[i],
        //         config
        //     );
        // }
        // now get the groups for the meeting and load in REDUX
        const res = await axios.get(`/api/groups/meeting/${mid}`);
        dispatch({ type: CLEAR_GROUPS });
        dispatch({
            type: GET_GROUPS,
            payload: res.data,
        });
    } catch (err) {
        console.log('actions/gatherings.js addDefaultGroups');
        console.error(err);
        // dispatch({
        //     //actions:getGroups
        //     type: GROUP_ERROR,
        //     payload: {
        //         msg: err.response.statusText,
        //         status: err.response.status,
        //     },
        // });
    }
};
// Create or update gathering
// MODIFIED FOR MEETER5
export const createGathering = (formData, history, cid, edit = false) => async (
    dispatch
) => {
    try {
        if (formData._id.length < 1) {
            //this is an add, so delete _id and meetingId from formData
            delete formData._id;
            delete formData.meetingId;
        } else {
            formData.meetingId = formData._id;
            //formData._id = '';
        }
        //-----------------------------------------------
        // need to add the tenantId to the data to put
        //-----------------------------------------------
        var client = 'meeting-' + cid;
        formData.tenantId = client;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post('/api/meeting', formData, config);

        dispatch({
            type: GET_GATHERING,
            payload: res.data,
        });

        dispatch(
            setAlert(edit ? 'Meeting Updated' : 'Meeting Created', 'success')
        );

        if (!edit) {
            history.push('/gatherings');
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: GATHERING_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
// Delete group
export const deleteGroup = (mtgId, groupId) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/meeting/${mtgId}/${groupId}`);

        dispatch({
            type: UPDATE_GATHERING,
            payload: res.data,
        });

        dispatch(setAlert('Group Removed', 'success'));
    } catch (err) {
        dispatch({
            type: GATHERING_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
// Edit group
export const editGroup = (mtgId, groupId) => async (dispatch) => {
    // try {
    //     const res = await axios.delete(`/api/meeting/${mtgId}/${groupId}`);
    //     dispatch({
    //         type: UPDATE_GATHERING,
    //         payload: res.data
    //     });
    //     dispatch(setAlert('Group Removed', 'success'));
    // } catch (err) {
    //     dispatch({
    //         type: GATHERING_ERROR,
    //         payload: {
    //             msg: err.response.statusText,
    //             status: err.response.status
    //         }
    //     });
    // }
};
export const createGroup = (formData, history, edit = false) => async (
    dispatch
) => {
    try {
    } catch (err) {}
};
