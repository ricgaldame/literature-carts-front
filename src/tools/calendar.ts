export const calendarTools = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const monthsOfYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  interface DayInfo {
    day: number;
    month: number;
    year: number;
    name: string;
    monthName: string;
    weekPosition: number;
  }
  
  interface DayInfoFrame extends DayInfo {
    isToday: boolean;
    isCurrentMonth: boolean;
  }

  const weekDayPosition = (date: Date) => {
    return (date.getDay() + 6) % 7
  }

  const dayInfo = (year?: number, month?: number, day?: number): DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();
    
    const analysisDate = new Date(y, m - 1, d);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };

  const nextDayInfo = (year?: number, month?: number, day?: number): DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    const analysisDate = new Date(y, m - 1, d);
    analysisDate.setDate(analysisDate.getDate() + 1);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };

  const previousDayInfo = (year?: number, month?: number, day?: number): DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    const analysisDate = new Date(y, m - 1, d);
    analysisDate.setDate(analysisDate.getDate() - 1);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };
  
  const nextWeekDayInfo = (year?: number, month?: number, day?: number) : DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    const analysisDate = new Date(y, m - 1, d);
    analysisDate.setDate(analysisDate.getDate() + 7);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();
  
    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };
  
  const previousWeekDayInfo = (year?: number, month?: number, day?: number) : DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    const analysisDate = new Date(y, m - 1, d);
    analysisDate.setDate(analysisDate.getDate() - 7);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();
  
    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };

  const nextMonthDayInfo = (year?: number, month?: number, day?: number): DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    let nextYear = y;
    let nextMonth = m + 1;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const daysInMonth = new Date(nextYear, nextMonth - 1, 0).getDate();
    const newDay = Math.min(d, daysInMonth);

    const analysisDate = new Date(nextYear, nextMonth - 1, newDay);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };

  const previousMonthDayInfo = (year?: number, month?: number, day?: number): DayInfo => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();

    let previousYear = y;
    let previousMonth = m - 1;

    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }

    const daysInMonth = new Date(previousYear, previousMonth - 1, 0).getDate();
    const newDay = Math.min(d, daysInMonth);

    const analysisDate = new Date(previousYear, previousMonth - 1, newDay);
    const weekdayPosition = weekDayPosition(analysisDate);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y
    };
  };

  const monthsDays = (year?: number, month?: number): DayInfo[] => {
    const today = new Date();
    const y = year ?? today.getFullYear();
    const m = month ?? today.getMonth() + 1;
    const daysInMonth = new Date(y, m, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => dayInfo(y, m, i + 1));
  }

  const previousMonthsDays = (year?: number, month?: number): DayInfo[] => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
  
    if (m === 1) {
      y -= 1;
      m = 12;
    } else {
      m -= 1;
    }
  
    return monthsDays(y, m);
  }

  const nextMonthsDays = (year?: number, month?: number): DayInfo[] => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
  
    if (m === 12) {
      y += 1;
      m = 1;
    } else {
      m += 1;
    }
  
    return monthsDays(y, m); // Reutilizamos monthsDays para obtener los días del mes siguiente
  }

  

  const dayFrame = (year?: number, month?: number, day?: number): DayInfoFrame => {
    const today = new Date();
    let y = year ?? today.getFullYear();
    let m = month ?? today.getMonth() + 1;
    let d = day ?? today.getDate();
    const currentDate = today;

    const analysisDate = new Date(y, m - 1, d);
    y = analysisDate.getFullYear();
    m = analysisDate.getMonth() + 1;
    d = analysisDate.getDate();

    const weekdayPosition = weekDayPosition(analysisDate);  
    const isToday = currentDate.getDate() === d && (currentDate.getMonth() + 1) === m && currentDate.getFullYear() === y;
  
    return {
      name: daysOfWeek[weekdayPosition],
      monthName: monthsOfYear[m - 1], 
      weekPosition: weekdayPosition,
      day: d,
      month: m,
      year: y,
      isToday: isToday,
      isCurrentMonth: true
    };
  };

  const weeksDaysFrame = (year?: number, month?: number, day?: number): DayInfoFrame[] => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    
    const y = year ?? todayYear;
    const m = month ?? todayMonth;
    
    // Obtener el primer día de la semana (lunes)
    const targetDay = day ?? todayDay;
    
    const weekStart = new Date(y, m - 1, targetDay);
    const weekdayPosition = weekDayPosition(weekStart);  // Ajuste para que Lunes sea 0
    weekStart.setDate(weekStart.getDate() - weekdayPosition); // Ajustar al lunes de la semana
    
    const week: { 
      name: string,
      monthName: string, 
      weekPosition: number, 
      day: number, 
      month: number, 
      year: number, 
      isToday: boolean, 
      isCurrentMonth: boolean 
    }[] = [];
    
    // Crear el arreglo con los días de la semana
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const weekPosition = weekDayPosition(currentDate);  // Ajuste para que Lunes sea 0
  
      week.push({
        name: daysOfWeek[weekPosition], // Usar el nombre del día
        monthName: monthsOfYear[currentDate.getMonth()],
        weekPosition,
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        isToday: currentDate.getDate() === todayDay && currentDate.getMonth() + 1 === todayMonth && currentDate.getFullYear() === todayYear,
        isCurrentMonth: currentDate.getMonth() + 1 === m
      });
    }
    
    return week;
  };

  

  const monthsDaysFrame = (year?: number, month?: number): DayInfoFrame[][] => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
  
    const y = year ?? todayYear;
    const m = month ?? todayMonth;
  
    const firstDayOfMonth = new Date(y, m - 1, 1);
    const firstDayWeekday = weekDayPosition(firstDayOfMonth);
  
    // Días del mes actual, anterior y siguiente
    const currentMonthDays = monthsDays(y, m);
    const prevMonthDays = previousMonthsDays(y, m);
    const nextMonthDays = nextMonthsDays(y, m);
  
    // Obtener mes anterior y siguiente
    const prevMonthData = previousMonthDayInfo(y, m);
    const nextMonthData = nextMonthDayInfo(y, m);
  
    const weeks: { 
      name: string,
      monthName: string, 
      weekPosition: number, 
      day: number, 
      month: number, 
      year: number, 
      isToday: boolean, 
      isCurrentMonth: boolean 
    }[][] = [];
    let currentWeek: { 
      name: string, 
      monthName: string,
      weekPosition: number, 
      day: number, 
      month: number, 
      year: number, 
      isToday: boolean, 
      isCurrentMonth: boolean 
    }[] = [];
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = prevMonthDays[prevMonthDays.length - 1 - i];
      currentWeek.push({
        name: dayInfo(prevMonthData.year, prevMonthData.month, day.day).name,
        monthName: monthsOfYear[prevMonthData.month - 1],
        weekPosition: currentWeek.length,
        day: day.day,
        month: prevMonthData.month,
        year: prevMonthData.year,
        isToday: day.day === todayDay && prevMonthData.month === todayMonth && prevMonthData.year === todayYear,
        isCurrentMonth: false
      });
    }
  
    // Agregar días del mes actual
    currentMonthDays.forEach(day => {
      currentWeek.push({
        name: dayInfo(y, m, day.day).name,
        monthName: monthsOfYear[m - 1],
        weekPosition: currentWeek.length,
        day: day.day,
        month: m,
        year: y,
        isToday: day.day === todayDay && m === todayMonth && y === todayYear,
        isCurrentMonth: true
      });
  
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  
    // Agregar días del mes siguiente para completar la última semana
    if (currentWeek.length > 0) {
      for (let i = 0; currentWeek.length < 7; i++) {
        currentWeek.push({
          name: dayInfo(nextMonthData.year, nextMonthData.month, nextMonthDays[i].day).name,
          monthName: monthsOfYear[nextMonthData.month - 1],
          weekPosition: currentWeek.length,
          day: nextMonthDays[i].day,
          month: nextMonthData.month,
          year: nextMonthData.year,
          isToday: nextMonthDays[i].day === todayDay && nextMonthData.month === todayMonth && nextMonthData.year === todayYear,
          isCurrentMonth: false
        });
      }
      weeks.push(currentWeek);
    }
  
    return weeks;
  };

  const formatingDate = (dateString: any) => {
    const dateStringParts = dateString.split('-');
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const date = new Date(parseInt(dateStringParts[0]),parseInt(dateStringParts[1]) - 1, parseInt(dateStringParts[2]));
    const dayIndex = (date.getDay() + 6) % 7; // Ajusta para que lunes sea el primer día
    const monthIndex = date.getMonth();
    const dayNumber = date.getDate();
    const yearNumber = date.getFullYear();
    
    return {
        day: {
            full: days[dayIndex],
            short: days[dayIndex].slice(0, 3),
            number: dayNumber,
            numberString: dayNumber.toString().padStart(2, '0')
        },
        month: {
            full: months[monthIndex],
            short: months[monthIndex].slice(0, 3),
            number: monthIndex + 1,
            numberString: (monthIndex + 1).toString().padStart(2, '0')
        },
        year: {
            full: yearNumber.toString(),
            short: yearNumber.toString().slice(-2),
            number: yearNumber,
            numberString: yearNumber.toString()
        }
    };
  };

  const getCurrentDateToString = () => {
    const currentDate = new Date();
		return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  }

  return {
    daysOfWeek,
    dayInfo,
    previousDayInfo,
    nextDayInfo,
    previousWeekDayInfo,
    nextWeekDayInfo,
    previousMonthDayInfo,
    nextMonthDayInfo, 
    dayFrame,
    weeksDaysFrame,
    monthsDaysFrame,
    formatingDate,
    getCurrentDateToString  
  }
}
