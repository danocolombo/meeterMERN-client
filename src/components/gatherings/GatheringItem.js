import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteGathering } from '../../actions/gathering';

const GatheringItem = ({
    deleteGathering,
    gathering: {
        id,
        meetingDate,
        title,
        supportRole,
        facilitator,
        attendance,
        newcomers,
        meetingType,
    },
}) => (
    <Fragment>
        <div className={meetingType !== 'Other' ? 'PersonBox' : 'OtherBox'}>
            <Fragment>
                <div className='DeleteTarget'>
                    <a
                        id='deleteGathering'
                        title='-'
                        href='/#'
                        onClick={() => deleteGathering(id)}
                    >
                        <i className='fas fa-minus-circle'></i>
                    </a>
                </div>
            </Fragment>
            <div>
                <Link to={`/EditGathering/${id}`}>
                    {moment.utc(meetingDate).format('ll')}
                </Link>
                <br />
                {meetingType}: {title}
                {supportRole && (
                    <Fragment>
                        <br />
                        {supportRole}
                    </Fragment>
                )}
                {attendance > 0 && (
                    <Fragment>
                        <br />
                        Attendance: {attendance}
                    </Fragment>
                )}
                {newcomers > 0 && (
                    <Fragment>
                        <br />
                        Newcomers: {newcomers}
                    </Fragment>
                )}
                <br />
                <Link to={`/EditGathering/${id}`}>
                    <i className='fas fa-pen'></i>
                </Link>
            </div>
        </div>
    </Fragment>
);

GatheringItem.propTypes = {
    gathering: PropTypes.object.isRequired,
    deleteGathering: PropTypes.func.isRequired,
};

export default connect(null, { deleteGathering })(GatheringItem);
//post bg-white p-1 my-1
