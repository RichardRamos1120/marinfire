import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import crewSenseService, { Assignment, ScheduleResponse } from '../../../../services/crewSenseService';

const ShiftSchedule: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(moment().tz('America/Los_Angeles'));

  useEffect(() => {
    // Only load schedule data once when component mounts
    if (!scheduleData) {
      loadSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // The /v1/schedule endpoint returns all available schedule data
      // Based on testing, date parameters cause a 400 error, so we fetch all data
      const data = await crewSenseService.getSchedule();
      console.log('Schedule data received:', data);
      setScheduleData(data);
    } catch (err: any) {
      console.error('Error loading schedule:', err);
      setError(`Failed to load schedule: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForDate = (date: string): Assignment[] => {
    if (!scheduleData?.days?.[date]) {
      return [];
    }
    return scheduleData.days[date].assignments || [];
  };

  const getStaffingStatus = (assignment: Assignment) => {
    const totalStaffed = assignment.shifts.length;
    const minimumRequired = assignment.minimum_staffing;
    
    if (totalStaffed === 0) return { color: 'red', status: 'Unstaffed' };
    if (totalStaffed < minimumRequired) return { color: 'yellow', status: 'Under-staffed' };
    return { color: 'green', status: 'Fully staffed' };
  };

  const formatDateTime = (dateTimeStr: string) => {
    return moment(dateTimeStr).format('HH:mm');
  };

  const getFullStationName = (abbreviation: string): string => {
    // Convert fire department abbreviations to full names
    if (abbreviation.startsWith('E')) {
      const stationNum = abbreviation.substring(1);
      return `Engine ${stationNum} (Station ${stationNum})`;
    }
    if (abbreviation.startsWith('R')) {
      const stationNum = abbreviation.substring(1);
      return `Rescue ${stationNum} (Station ${stationNum})`;
    }
    if (abbreviation.startsWith('T')) {
      const stationNum = abbreviation.substring(1);
      return `Truck ${stationNum} (Station ${stationNum})`;
    }
    if (abbreviation.startsWith('B')) {
      const batchNum = abbreviation.substring(1);
      return `Battalion Chief ${batchNum}`;
    }
    if (abbreviation.startsWith('M')) {
      const stationNum = abbreviation.substring(1);
      return `Medic ${stationNum} (Station ${stationNum})`;
    }
    
    // Handle special assignments
    const specialAssignments: { [key: string]: string } = {
      'Disaster Prep Public Educator': 'Disaster Preparedness Public Educator',
      'Veg Mgmt Specialist': 'Vegetation Management Specialist',
      'Human Rresources Coordinator': 'Human Resources Coordinator',
      'Single Resource 2 (Line)': 'Single Resource 2 (Line Assignment)',
      'Single Resource 3 (Line)': 'Single Resource 3 (Line Assignment)',
      'Single Resource 4 (Line)': 'Single Resource 4 (Line Assignment)'
    };
    
    return specialAssignments[abbreviation] || abbreviation;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = selectedDate.clone();
    direction === 'prev' ? newDate.subtract(1, 'day') : newDate.add(1, 'day');
    setSelectedDate(newDate);
  };

  const renderAssignments = () => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const assignments = getAssignmentsForDate(dateKey);
    const dayData = scheduleData?.days?.[dateKey];

    if (!dayData) {
      return (
        <div className="text-center py-12 text-gray-500">
          No schedule data available for this date.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {dayData.day_color && (
          <div 
            className="p-3 rounded-lg text-center font-semibold"
            style={{ 
              backgroundColor: dayData.day_color.color,
              color: '#ffffff'
            }}
          >
            {dayData.day_color.label}
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No assignments scheduled for this date.
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((assignment) => {
              const staffingStatus = getStaffingStatus(assignment);
              return (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{getFullStationName(assignment.name)}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(assignment.start)} - {formatDateTime(assignment.end)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        staffingStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                        staffingStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {staffingStatus.status}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-700">
                          {assignment.shifts.length}/{assignment.minimum_staffing}
                        </div>
                        <div className="text-xs text-gray-500">Staffed</div>
                      </div>
                    </div>
                  </div>

                  {assignment.qualifiers_needed.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Required Qualifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {assignment.qualifiers_needed.map(qual => (
                          <span 
                            key={qual.id} 
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: qual.color,
                              color: qual.text_color
                            }}
                          >
                            {qual.shortcode} - {qual.name} (Min: {qual.minimum_staffing})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignment.shifts.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Assigned Personnel:</p>
                      <div className="space-y-2">
                        {assignment.shifts.map(shift => (
                          <div key={shift.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-gray-900">{shift.user.name}</p>
                                <div className="flex gap-2 mt-1">
                                  {shift.qualifiers.map(qual => (
                                    <span 
                                      key={qual.id}
                                      className="text-xs px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: qual.color,
                                        color: qual.text_color
                                      }}
                                    >
                                      {qual.shortcode}
                                    </span>
                                  ))}
                                  {shift.groups.map(group => (
                                    <span key={group.id} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                      {group.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{shift.work_type.name}</p>
                              <p className="text-xs text-gray-400">
                                {formatDateTime(shift.start)} - {formatDateTime(shift.end)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignment.notes && (
                    <div className="mt-3 text-sm text-gray-600 italic">
                      Note: {assignment.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {dayData.time_off && dayData.time_off.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Time Off</h4>
            <div className="space-y-2">
              {dayData.time_off.map((timeOff: any) => (
                <div key={timeOff.id} className="bg-orange-50 rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{timeOff.user.name}</span>
                    <span className="text-gray-600">{timeOff.time_off_type.name}</span>
                  </div>
                  {timeOff.notes && <p className="text-gray-500 mt-1">{timeOff.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {dayData.trades && dayData.trades.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Trades</h4>
            <div className="space-y-2">
              {dayData.trades.map((trade: any) => (
                <div key={trade.id} className="bg-blue-50 rounded p-3 text-sm">
                  <span className="font-medium">{trade.requesting_user.name}</span>
                  <span className="mx-2">→</span>
                  <span className="font-medium">{trade.accepting_user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.format('MMMM D, YYYY')}
            </h3>
            <p className="text-sm text-gray-500">{selectedDate.format('dddd')}</p>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next day"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setSelectedDate(moment().tz('America/Los_Angeles'))}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Today
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && scheduleData && renderAssignments()}
    </div>
  );
};

export default ShiftSchedule;