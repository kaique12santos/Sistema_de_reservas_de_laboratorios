class RecurrenceHelper {
  static normalizeDateString(dateString) {
    if (!dateString || typeof dateString !== 'string') return null;
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      return null;
    }
    return date;
  }

  static formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static generateDates(startDate, endDate, weekdays, holidays = [], cycleStart, cycleEnd) {
    const validWeekdays = Array.isArray(weekdays)
      ? [...new Set(weekdays.map((day) => Number(day)).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))]
      : [];

    if (validWeekdays.length === 0) return [];

    const start = RecurrenceHelper.normalizeDateString(startDate);
    const end = RecurrenceHelper.normalizeDateString(endDate);
    const cycleStartDate = RecurrenceHelper.normalizeDateString(cycleStart);
    const cycleEndDate = RecurrenceHelper.normalizeDateString(cycleEnd);

    if (!start || !end || !cycleStartDate || !cycleEndDate) return [];

    const holidaySet = new Set(
      (holidays || [])
        .map((holiday) => {
          if (typeof holiday === 'string') return holiday;
          if (holiday && holiday.date) return String(holiday.date).slice(0, 10);
          return null;
        })
        .filter(Boolean)
    );

    const dates = [];
    let current = start;

    while (current <= end) {
      const formatted = RecurrenceHelper.formatDate(current);
      const isWithinCycle = current >= cycleStartDate && current <= cycleEndDate;
      const isSelectedWeekday = validWeekdays.includes(current.getUTCDay());
      const isHoliday = holidaySet.has(formatted);

      if (isWithinCycle && isSelectedWeekday && !isHoliday) {
        dates.push(formatted);
      }

      current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() + 1));
    }

    return dates;
  }
}

export default RecurrenceHelper;
