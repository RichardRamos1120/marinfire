import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import crewSenseService, { Assignment, ScheduleResponse } from '../../../../services/crewSenseService';

const ShiftSchedule: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(moment().tz('America/Los_Angeles'));
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

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

  const getUnitType = (name: string): string => {
    if (name.startsWith('E')) return 'engines';
    if (name.startsWith('R')) return 'rescues';
    if (name.startsWith('T')) return 'trucks';
    if (name.startsWith('B')) return 'command';
    if (name.startsWith('M')) return 'medical';
    return 'support';
  };

  const getDisplayName = (name: string): { short: string; full: string } => {
    if (name.startsWith('E')) {
      const num = name.substring(1);
      return { short: `E${num}`, full: `Engine ${num}` };
    }
    if (name.startsWith('R')) {
      const num = name.substring(1);
      return { short: `R${num}`, full: `Rescue ${num}` };
    }
    if (name.startsWith('T')) {
      const num = name.substring(1);
      return { short: `T${num}`, full: `Truck ${num}` };
    }
    if (name.startsWith('B')) {
      const num = name.substring(1);
      return { short: `BC${num}`, full: `Battalion Chief ${num}` };
    }
    if (name.startsWith('M')) {
      const num = name.substring(1);
      return { short: `M${num}`, full: `Medic ${num}` };
    }
    
    // Handle special assignments with shorter names
    const specialNames: { [key: string]: { short: string; full: string } } = {
      'Disaster Prep Public Educator': { short: 'DPPE', full: 'Disaster Prep Educator' },
      'Veg Mgmt Specialist': { short: 'VMS', full: 'Vegetation Management' },
      'Human Rresources Coordinator': { short: 'HR', full: 'Human Resources' },
      'Single Resource 2 (Line)': { short: 'SR2', full: 'Single Resource 2' },
      'Single Resource 3 (Line)': { short: 'SR3', full: 'Single Resource 3' },
      'Single Resource 4 (Line)': { short: 'SR4', full: 'Single Resource 4' }
    };
    
    return specialNames[name] || { short: name, full: name };
  };

  const filterAssignments = (assignments: Assignment[]): Assignment[] => {
    let filtered = assignments;

    // Filter by unit type
    if (unitFilter !== 'all') {
      filtered = filtered.filter(assignment => getUnitType(assignment.name) === unitFilter);
    }

    // Filter by critical status
    if (showCriticalOnly) {
      filtered = filtered.filter(assignment => {
        const status = getStaffingStatus(assignment);
        return status.color === 'red' || status.color === 'yellow';
      });
    }

    // Sort by staffing status: fully staffed first, then under-staffed, then unstaffed
    filtered.sort((a, b) => {
      const statusA = getStaffingStatus(a);
      const statusB = getStaffingStatus(b);
      
      // Priority order: green (fully staffed) -> yellow (under-staffed) -> red (unstaffed)
      const statusPriority = { green: 0, yellow: 1, red: 2 };
      const priorityA = statusPriority[statusA.color as keyof typeof statusPriority];
      const priorityB = statusPriority[statusB.color as keyof typeof statusPriority];
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Within same status, sort by station name/number
      return a.name.localeCompare(b.name);
    });

    return filtered;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = selectedDate.clone();
    direction === 'prev' ? newDate.subtract(1, 'day') : newDate.add(1, 'day');
    setSelectedDate(newDate);
  };

  const renderStationCard = (assignment: Assignment) => {
    const staffingStatus = getStaffingStatus(assignment);
    const displayName = getDisplayName(assignment.name);
    
    // Get border and background colors based on status
    const statusColors = {
      green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800' },
      yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-800' },
      red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800' }
    };
    
    const colors = statusColors[staffingStatus.color as keyof typeof statusColors];
    
    return (
      <div key={assignment.id} className={`bg-white rounded-lg border-2 ${colors.border} p-5 hover:shadow-lg transition-all duration-200 min-h-[200px]`}>
        {/* Station Header */}
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className={`${colors.bg} ${colors.text} px-3 py-2 rounded-lg font-bold text-lg min-w-[60px] text-center`}>
              {displayName.short}
            </div>
            
            {/* Staffing Count - Moved to give more space */}
            <div className="text-right flex-shrink-0">
              <div className={`text-3xl font-bold ${colors.text} leading-none`}>
                {assignment.shifts.length}/{assignment.minimum_staffing}
              </div>
              <div className="text-xs text-gray-500 mt-1">Staffed</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{displayName.full}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(assignment.start)} - {formatDateTime(assignment.end)}
            </p>
          </div>
        </div>

        {/* Personnel List */}
        <div className="mb-4">
          {assignment.shifts.length > 0 ? (
            <div className="space-y-2">
              {assignment.shifts.slice(0, 3).map(shift => (
                <div key={shift.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm truncate flex-1">
                      {shift.user.name}
                    </span>
                    {shift.groups.length > 0 && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {shift.groups[0].label}
                      </span>
                    )}
                  </div>
                  {shift.qualifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {shift.qualifiers.slice(0, 2).map(qual => (
                        <span 
                          key={qual.id}
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{
                            backgroundColor: qual.color,
                            color: qual.text_color
                          }}
                        >
                          {qual.shortcode}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {assignment.shifts.length > 3 && (
                <div className="text-xs text-gray-500 italic pt-1">
                  +{assignment.shifts.length - 3} more personnel
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-600 font-medium py-2">
              ⚠️ No personnel assigned
            </div>
          )}
        </div>

        {/* Required Qualifications */}
        {assignment.qualifiers_needed.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Required:</div>
            <div className="flex flex-wrap gap-1">
              {assignment.qualifiers_needed.map(qual => (
                <span 
                  key={qual.id} 
                  className="text-xs px-2 py-1 rounded font-medium"
                  style={{
                    backgroundColor: qual.color,
                    color: qual.text_color
                  }}
                >
                  {qual.shortcode}×{qual.minimum_staffing}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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

    const filteredAssignments = filterAssignments(assignments);
    const criticalCount = assignments.filter(a => {
      const status = getStaffingStatus(a);
      return status.color === 'red' || status.color === 'yellow';
    }).length;

    return (
      <div>
        {/* Status Overview */}
        <div className="mb-6">
          {dayData.day_color && (
            <div 
              className="p-3 rounded-lg text-center font-semibold mb-4"
              style={{ 
                backgroundColor: dayData.day_color.color,
                color: '#ffffff'
              }}
            >
              {dayData.day_color.label}
            </div>
          )}
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Total Units: <span className="font-semibold">{assignments.length}</span>
            </span>
            {criticalCount > 0 && (
              <span className="text-red-600">
                Critical: <span className="font-semibold">{criticalCount}</span>
              </span>
            )}
            <span className="text-gray-600">
              Showing: <span className="font-semibold">{filteredAssignments.length}</span>
            </span>
          </div>
        </div>

        {/* Station Grid */}
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No units match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map(assignment => renderStationCard(assignment))}
          </div>
        )}

        {/* Additional Info Sections */}
        {(dayData.time_off?.length || dayData.trades?.length) && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dayData.time_off && dayData.time_off.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Personnel Time Off</h4>
                <div className="space-y-2">
                  {dayData.time_off.map((timeOff: any) => (
                    <div key={timeOff.id} className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{timeOff.user.name}</span>
                        <span className="text-orange-700">{timeOff.time_off_type.name}</span>
                      </div>
                      {timeOff.notes && <p className="text-gray-600 mt-1">{timeOff.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dayData.trades && dayData.trades.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Shift Trades</h4>
                <div className="space-y-2">
                  {dayData.trades.map((trade: any) => (
                    <div key={trade.id} className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                      <span className="font-medium">{trade.requesting_user.name}</span>
                      <span className="mx-2 text-blue-600">→</span>
                      <span className="font-medium">{trade.accepting_user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header with Date Navigation and Filters */}
      <div className="space-y-4 mb-6">
        {/* Date Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Unit Type Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          
          {/* Unit Type Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Units', icon: '🚒' },
              { id: 'engines', label: 'Engines', icon: '🚒' },
              { id: 'rescues', label: 'Rescues', icon: '🚑' },
              { id: 'command', label: 'Command', icon: '👨‍🚒' },
              { id: 'support', label: 'Support', icon: '🔧' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setUnitFilter(filter.id)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  unitFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>

          {/* Critical Only Toggle */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                showCriticalOnly
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">⚠️</span>
              Critical Only
            </button>
          </div>
        </div>
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