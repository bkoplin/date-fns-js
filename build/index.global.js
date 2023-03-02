'use strict'
;(() => {
  // src/toDate/index.ts
  function toDate(argument) {
    const argStr = Object.prototype.toString.call(argument)
    if (
      argument instanceof Date ||
      (typeof argument === 'object' && argStr === '[object Date]')
    ) {
      return new argument.constructor(argument.getTime())
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument)
    } else {
      return /* @__PURE__ */ new Date(NaN)
    }
  }

  // src/constructFrom/index.ts
  function constructFrom(date, value) {
    if (date instanceof Date) {
      return new date.constructor(value)
    } else {
      return new Date(value)
    }
  }

  // src/addDays/index.ts
  function addDays(dirtyDate, amount) {
    const date = toDate(dirtyDate)
    if (isNaN(amount)) return constructFrom(dirtyDate, NaN)
    if (!amount) {
      return date
    }
    date.setDate(date.getDate() + amount)
    return date
  }

  // src/addMonths/index.ts
  function addMonths(dirtyDate, amount) {
    const date = toDate(dirtyDate)
    if (isNaN(amount)) return constructFrom(dirtyDate, NaN)
    if (!amount) {
      return date
    }
    const dayOfMonth = date.getDate()
    const endOfDesiredMonth = constructFrom(dirtyDate, date.getTime())
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0)
    const daysInMonth = endOfDesiredMonth.getDate()
    if (dayOfMonth >= daysInMonth) {
      return endOfDesiredMonth
    } else {
      date.setFullYear(
        endOfDesiredMonth.getFullYear(),
        endOfDesiredMonth.getMonth(),
        dayOfMonth
      )
      return date
    }
  }

  // src/add/index.ts
  function add(dirtyDate, duration) {
    const {
      years = 0,
      months: months2 = 0,
      weeks = 0,
      days: days2 = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = duration
    const date = toDate(dirtyDate)
    const dateWithMonths =
      months2 || years ? addMonths(date, months2 + years * 12) : date
    const dateWithDays =
      days2 || weeks
        ? addDays(dateWithMonths, days2 + weeks * 7)
        : dateWithMonths
    const minutesToAdd = minutes + hours * 60
    const secondsToAdd = seconds + minutesToAdd * 60
    const msToAdd = secondsToAdd * 1e3
    const finalDate = constructFrom(dirtyDate, dateWithDays.getTime() + msToAdd)
    return finalDate
  }

  // src/isSaturday/index.ts
  function isSaturday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 6
  }

  // src/isSunday/index.ts
  function isSunday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 0
  }

  // src/isWeekend/index.ts
  function isWeekend(dirtyDate) {
    const date = toDate(dirtyDate)
    const day = date.getDay()
    return day === 0 || day === 6
  }

  // src/addBusinessDays/index.ts
  function addBusinessDays(dirtyDate, amount) {
    const date = toDate(dirtyDate)
    const startedOnWeekend = isWeekend(date)
    if (isNaN(amount)) return constructFrom(dirtyDate, NaN)
    const hours = date.getHours()
    const sign = amount < 0 ? -1 : 1
    const fullWeeks = Math.trunc(amount / 5)
    date.setDate(date.getDate() + fullWeeks * 7)
    let restDays = Math.abs(amount % 5)
    while (restDays > 0) {
      date.setDate(date.getDate() + sign)
      if (!isWeekend(date)) restDays -= 1
    }
    if (startedOnWeekend && isWeekend(date) && amount !== 0) {
      if (isSaturday(date)) date.setDate(date.getDate() + (sign < 0 ? 2 : -1))
      if (isSunday(date)) date.setDate(date.getDate() + (sign < 0 ? 1 : -2))
    }
    date.setHours(hours)
    return date
  }

  // src/addMilliseconds/index.ts
  function addMilliseconds(dirtyDate, amount) {
    const timestamp = toDate(dirtyDate).getTime()
    return constructFrom(dirtyDate, timestamp + amount)
  }

  // src/constants/index.ts
  var daysInWeek = 7
  var daysInYear = 365.2425
  var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3
  var millisecondsInWeek = 6048e5
  var millisecondsInDay = 864e5
  var millisecondsInMinute = 6e4
  var millisecondsInHour = 36e5
  var millisecondsInSecond = 1e3
  var minTime = -maxTime
  var minutesInYear = 525600
  var minutesInMonth = 43200
  var minutesInDay = 1440
  var minutesInHour = 60
  var monthsInQuarter = 3
  var monthsInYear = 12
  var quartersInYear = 4
  var secondsInHour = 3600
  var secondsInMinute = 60
  var secondsInDay = secondsInHour * 24
  var secondsInWeek = secondsInDay * 7
  var secondsInYear = secondsInDay * daysInYear
  var secondsInMonth = secondsInYear / 12
  var secondsInQuarter = secondsInMonth * 3

  // src/addHours/index.ts
  function addHours(dirtyDate, amount) {
    return addMilliseconds(dirtyDate, amount * millisecondsInHour)
  }

  // src/_lib/defaultOptions/index.ts
  var defaultOptions = {}
  function getDefaultOptions() {
    return defaultOptions
  }
  function setDefaultOptions(newOptions) {
    defaultOptions = newOptions
  }

  // src/startOfWeek/index.ts
  function startOfWeek(dirtyDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const weekStartsOn =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.weekStartsOn) != null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.weekStartsOn) != null
            ? _d
            : defaultOptions2.weekStartsOn) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.weekStartsOn) != null
        ? _h
        : 0
    const date = toDate(dirtyDate)
    const day = date.getDay()
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    date.setDate(date.getDate() - diff)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/startOfISOWeek/index.ts
  function startOfISOWeek(dirtyDate) {
    return startOfWeek(dirtyDate, { weekStartsOn: 1 })
  }

  // src/getISOWeekYear/index.ts
  function getISOWeekYear(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const fourthOfJanuaryOfNextYear = constructFrom(dirtyDate, 0)
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4)
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0)
    const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear)
    const fourthOfJanuaryOfThisYear = constructFrom(dirtyDate, 0)
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4)
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0)
    const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear)
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  // src/startOfDay/index.ts
  function startOfDay(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/_lib/getTimezoneOffsetInMilliseconds/index.ts
  function getTimezoneOffsetInMilliseconds(date) {
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    )
    utcDate.setUTCFullYear(date.getFullYear())
    return date.getTime() - utcDate.getTime()
  }

  // src/differenceInCalendarDays/index.ts
  function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
    const startOfDayLeft = startOfDay(dirtyDateLeft)
    const startOfDayRight = startOfDay(dirtyDateRight)
    const timestampLeft =
      startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft)
    const timestampRight =
      startOfDayRight.getTime() -
      getTimezoneOffsetInMilliseconds(startOfDayRight)
    return Math.round((timestampLeft - timestampRight) / millisecondsInDay)
  }

  // src/startOfISOWeekYear/index.ts
  function startOfISOWeekYear(dirtyDate) {
    const year = getISOWeekYear(dirtyDate)
    const fourthOfJanuary = constructFrom(dirtyDate, 0)
    fourthOfJanuary.setFullYear(year, 0, 4)
    fourthOfJanuary.setHours(0, 0, 0, 0)
    const date = startOfISOWeek(fourthOfJanuary)
    return date
  }

  // src/setISOWeekYear/index.ts
  function setISOWeekYear(dirtyDate, isoWeekYear) {
    let date = toDate(dirtyDate)
    const diff = differenceInCalendarDays(date, startOfISOWeekYear(date))
    const fourthOfJanuary = constructFrom(dirtyDate, 0)
    fourthOfJanuary.setFullYear(isoWeekYear, 0, 4)
    fourthOfJanuary.setHours(0, 0, 0, 0)
    date = startOfISOWeekYear(fourthOfJanuary)
    date.setDate(date.getDate() + diff)
    return date
  }

  // src/addISOWeekYears/index.ts
  function addISOWeekYears(dirtyDate, amount) {
    return setISOWeekYear(dirtyDate, getISOWeekYear(dirtyDate) + amount)
  }

  // src/addMinutes/index.ts
  function addMinutes(dirtyDate, amount) {
    return addMilliseconds(dirtyDate, amount * millisecondsInMinute)
  }

  // src/addQuarters/index.ts
  function addQuarters(dirtyDate, amount) {
    const months2 = amount * 3
    return addMonths(dirtyDate, months2)
  }

  // src/addSeconds/index.ts
  function addSeconds(dirtyDate, amount) {
    return addMilliseconds(dirtyDate, amount * 1e3)
  }

  // src/addWeeks/index.ts
  function addWeeks(dirtyDate, amount) {
    const days2 = amount * 7
    return addDays(dirtyDate, days2)
  }

  // src/addYears/index.ts
  function addYears(dirtyDate, amount) {
    return addMonths(dirtyDate, amount * 12)
  }

  // src/areIntervalsOverlapping/index.ts
  function areIntervalsOverlapping(intervalLeft, intervalRight, options) {
    const leftStartTime = toDate(intervalLeft.start).getTime()
    const leftEndTime = toDate(intervalLeft.end).getTime()
    const rightStartTime = toDate(intervalRight.start).getTime()
    const rightEndTime = toDate(intervalRight.end).getTime()
    if (!(leftStartTime <= leftEndTime && rightStartTime <= rightEndTime)) {
      throw new RangeError('Invalid interval')
    }
    if (options == null ? void 0 : options.inclusive) {
      return leftStartTime <= rightEndTime && rightStartTime <= leftEndTime
    }
    return leftStartTime < rightEndTime && rightStartTime < leftEndTime
  }

  // src/max/index.ts
  function max(datesArray) {
    let result
    datesArray.forEach(function (dirtyDate) {
      const currentDate = toDate(dirtyDate)
      if (
        result === void 0 ||
        result < currentDate ||
        isNaN(Number(currentDate))
      ) {
        result = currentDate
      }
    })
    return result || /* @__PURE__ */ new Date(NaN)
  }

  // src/min/index.ts
  function min(datesArray) {
    let result
    datesArray.forEach(function (dirtyDate) {
      let currentDate = toDate(dirtyDate)
      if (
        result === void 0 ||
        result > currentDate ||
        isNaN(currentDate.getDate())
      ) {
        result = currentDate
      }
    })
    return result || /* @__PURE__ */ new Date(NaN)
  }

  // src/clamp/index.ts
  function clamp(date, { start, end }) {
    return min([max([date, start]), end])
  }

  // src/closestIndexTo/index.ts
  function closestIndexTo(dirtyDateToCompare, datesArray) {
    const dateToCompare = toDate(dirtyDateToCompare)
    if (isNaN(Number(dateToCompare))) return NaN
    const timeToCompare = dateToCompare.getTime()
    let result
    let minDistance
    datesArray.forEach(function (dirtyDate, index) {
      const currentDate = toDate(dirtyDate)
      if (isNaN(Number(currentDate))) {
        result = NaN
        minDistance = NaN
        return
      }
      const distance = Math.abs(timeToCompare - currentDate.getTime())
      if (result == null || distance < minDistance) {
        result = index
        minDistance = distance
      }
    })
    return result
  }

  // src/closestTo/index.ts
  function closestTo(dirtyDateToCompare, datesArray) {
    const dateToCompare = toDate(dirtyDateToCompare)
    if (isNaN(Number(dateToCompare)))
      return constructFrom(dirtyDateToCompare, NaN)
    const timeToCompare = dateToCompare.getTime()
    let result
    let minDistance
    datesArray.forEach((dirtyDate) => {
      const currentDate = toDate(dirtyDate)
      if (isNaN(Number(currentDate))) {
        result = constructFrom(dirtyDateToCompare, NaN)
        minDistance = NaN
        return
      }
      const distance = Math.abs(timeToCompare - currentDate.getTime())
      if (result == null || distance < minDistance) {
        result = currentDate
        minDistance = distance
      }
    })
    return result
  }

  // src/compareAsc/index.ts
  function compareAsc(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const diff = dateLeft.getTime() - dateRight.getTime()
    if (diff < 0) {
      return -1
    } else if (diff > 0) {
      return 1
    } else {
      return diff
    }
  }

  // src/compareDesc/index.ts
  function compareDesc(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const diff = dateLeft.getTime() - dateRight.getTime()
    if (diff > 0) {
      return -1
    } else if (diff < 0) {
      return 1
    } else {
      return diff
    }
  }

  // src/daysToWeeks/index.ts
  function daysToWeeks(days2) {
    const weeks = days2 / daysInWeek
    return Math.floor(weeks)
  }

  // src/isSameDay/index.ts
  function isSameDay(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfDay = startOfDay(dirtyDateLeft)
    const dateRightStartOfDay = startOfDay(dirtyDateRight)
    return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime()
  }

  // src/isDate/index.ts
  function isDate(value) {
    return (
      value instanceof Date ||
      (typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Date]')
    )
  }

  // src/isValid/index.ts
  function isValid(dirtyDate) {
    if (!isDate(dirtyDate) && typeof dirtyDate !== 'number') {
      return false
    }
    const date = toDate(dirtyDate)
    return !isNaN(Number(date))
  }

  // src/differenceInBusinessDays/index.ts
  function differenceInBusinessDays(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    let dateRight = toDate(dirtyDateRight)
    if (!isValid(dateLeft) || !isValid(dateRight)) return NaN
    const calendarDifference = differenceInCalendarDays(dateLeft, dateRight)
    const sign = calendarDifference < 0 ? -1 : 1
    const weeks = Math.trunc(calendarDifference / 7)
    let result = weeks * 5
    dateRight = addDays(dateRight, weeks * 7)
    while (!isSameDay(dateLeft, dateRight)) {
      result += isWeekend(dateRight) ? 0 : sign
      dateRight = addDays(dateRight, sign)
    }
    return result === 0 ? 0 : result
  }

  // src/differenceInCalendarISOWeekYears/index.ts
  function differenceInCalendarISOWeekYears(dirtyDateLeft, dirtyDateRight) {
    return getISOWeekYear(dirtyDateLeft) - getISOWeekYear(dirtyDateRight)
  }

  // src/differenceInCalendarISOWeeks/index.ts
  function differenceInCalendarISOWeeks(dirtyDateLeft, dirtyDateRight) {
    const startOfISOWeekLeft = startOfISOWeek(dirtyDateLeft)
    const startOfISOWeekRight = startOfISOWeek(dirtyDateRight)
    const timestampLeft =
      startOfISOWeekLeft.getTime() -
      getTimezoneOffsetInMilliseconds(startOfISOWeekLeft)
    const timestampRight =
      startOfISOWeekRight.getTime() -
      getTimezoneOffsetInMilliseconds(startOfISOWeekRight)
    return Math.round((timestampLeft - timestampRight) / millisecondsInWeek)
  }

  // src/differenceInCalendarMonths/index.ts
  function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const yearDiff = dateLeft.getFullYear() - dateRight.getFullYear()
    const monthDiff = dateLeft.getMonth() - dateRight.getMonth()
    return yearDiff * 12 + monthDiff
  }

  // src/getQuarter/index.ts
  function getQuarter(dirtyDate) {
    const date = toDate(dirtyDate)
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return quarter
  }

  // src/differenceInCalendarQuarters/index.ts
  function differenceInCalendarQuarters(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const yearDiff = dateLeft.getFullYear() - dateRight.getFullYear()
    const quarterDiff = getQuarter(dateLeft) - getQuarter(dateRight)
    return yearDiff * 4 + quarterDiff
  }

  // src/differenceInCalendarWeeks/index.ts
  function differenceInCalendarWeeks(dirtyDateLeft, dirtyDateRight, options) {
    const startOfWeekLeft = startOfWeek(dirtyDateLeft, options)
    const startOfWeekRight = startOfWeek(dirtyDateRight, options)
    const timestampLeft =
      startOfWeekLeft.getTime() -
      getTimezoneOffsetInMilliseconds(startOfWeekLeft)
    const timestampRight =
      startOfWeekRight.getTime() -
      getTimezoneOffsetInMilliseconds(startOfWeekRight)
    return Math.round((timestampLeft - timestampRight) / millisecondsInWeek)
  }

  // src/differenceInCalendarYears/index.ts
  function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    return dateLeft.getFullYear() - dateRight.getFullYear()
  }

  // src/differenceInDays/index.ts
  function compareLocalAsc(dateLeft, dateRight) {
    const diff =
      dateLeft.getFullYear() - dateRight.getFullYear() ||
      dateLeft.getMonth() - dateRight.getMonth() ||
      dateLeft.getDate() - dateRight.getDate() ||
      dateLeft.getHours() - dateRight.getHours() ||
      dateLeft.getMinutes() - dateRight.getMinutes() ||
      dateLeft.getSeconds() - dateRight.getSeconds() ||
      dateLeft.getMilliseconds() - dateRight.getMilliseconds()
    if (diff < 0) {
      return -1
    } else if (diff > 0) {
      return 1
    } else {
      return diff
    }
  }
  function differenceInDays(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const sign = compareLocalAsc(dateLeft, dateRight)
    const difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight))
    dateLeft.setDate(dateLeft.getDate() - sign * difference)
    const isLastDayNotFull = Number(
      compareLocalAsc(dateLeft, dateRight) === -sign
    )
    const result = sign * (difference - isLastDayNotFull)
    return result === 0 ? 0 : result
  }

  // src/differenceInMilliseconds/index.ts
  function differenceInMilliseconds(dateLeft, dateRight) {
    return toDate(dateLeft).getTime() - toDate(dateRight).getTime()
  }

  // src/_lib/roundingMethods/index.ts
  var roundingMap = {
    ceil: Math.ceil,
    round: Math.round,
    floor: Math.floor,
    trunc: (value) => (value < 0 ? Math.ceil(value) : Math.floor(value)),
    // Math.trunc is not supported by IE
  }
  var defaultRoundingMethod = 'trunc'
  function getRoundingMethod(method) {
    return method ? roundingMap[method] : roundingMap[defaultRoundingMethod]
  }

  // src/differenceInHours/index.ts
  function differenceInHours(dateLeft, dateRight, options) {
    const diff =
      differenceInMilliseconds(dateLeft, dateRight) / millisecondsInHour
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(
      diff
    )
  }

  // src/subISOWeekYears/index.ts
  function subISOWeekYears(dirtyDate, amount) {
    return addISOWeekYears(dirtyDate, -amount)
  }

  // src/differenceInISOWeekYears/index.ts
  function differenceInISOWeekYears(dirtyDateLeft, dirtyDateRight) {
    let dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const sign = compareAsc(dateLeft, dateRight)
    const difference = Math.abs(
      differenceInCalendarISOWeekYears(dateLeft, dateRight)
    )
    dateLeft = subISOWeekYears(dateLeft, sign * difference)
    const isLastISOWeekYearNotFull = Number(
      compareAsc(dateLeft, dateRight) === -sign
    )
    const result = sign * (difference - isLastISOWeekYearNotFull)
    return result === 0 ? 0 : result
  }

  // src/differenceInMinutes/index.ts
  function differenceInMinutes(dateLeft, dateRight, options) {
    const diff =
      differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(
      diff
    )
  }

  // src/endOfDay/index.ts
  function endOfDay(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/endOfMonth/index.ts
  function endOfMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    const month = date.getMonth()
    date.setFullYear(date.getFullYear(), month + 1, 0)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/isLastDayOfMonth/index.ts
  function isLastDayOfMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    return endOfDay(date).getTime() === endOfMonth(date).getTime()
  }

  // src/differenceInMonths/index.ts
  function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const sign = compareAsc(dateLeft, dateRight)
    const difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight))
    let result
    if (difference < 1) {
      result = 0
    } else {
      if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
        dateLeft.setDate(30)
      }
      dateLeft.setMonth(dateLeft.getMonth() - sign * difference)
      let isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign
      if (
        isLastDayOfMonth(toDate(dirtyDateLeft)) &&
        difference === 1 &&
        compareAsc(dirtyDateLeft, dateRight) === 1
      ) {
        isLastMonthNotFull = false
      }
      result = sign * (difference - Number(isLastMonthNotFull))
    }
    return result === 0 ? 0 : result
  }

  // src/differenceInQuarters/index.ts
  function differenceInQuarters(dateLeft, dateRight, options) {
    const diff = differenceInMonths(dateLeft, dateRight) / 3
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(
      diff
    )
  }

  // src/differenceInSeconds/index.ts
  function differenceInSeconds(dateLeft, dateRight, options) {
    const diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(
      diff
    )
  }

  // src/differenceInWeeks/index.ts
  function differenceInWeeks(dateLeft, dateRight, options) {
    const diff = differenceInDays(dateLeft, dateRight) / 7
    return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(
      diff
    )
  }

  // src/differenceInYears/index.ts
  function differenceInYears(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    const sign = compareAsc(dateLeft, dateRight)
    const difference = Math.abs(differenceInCalendarYears(dateLeft, dateRight))
    dateLeft.setFullYear(1584)
    dateRight.setFullYear(1584)
    const isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign
    const result = sign * (difference - Number(isLastYearNotFull))
    return result === 0 ? 0 : result
  }

  // src/eachDayOfInterval/index.ts
  function eachDayOfInterval(interval2, options) {
    var _a
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    const endTime = endDate.getTime()
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const dates = []
    const currentDate = startDate
    currentDate.setHours(0, 0, 0, 0)
    const step = (_a = options == null ? void 0 : options.step) != null ? _a : 1
    if (step < 1 || isNaN(step))
      throw new RangeError('`options.step` must be a number greater than 1')
    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate))
      currentDate.setDate(currentDate.getDate() + step)
      currentDate.setHours(0, 0, 0, 0)
    }
    return dates
  }

  // src/eachHourOfInterval/index.ts
  function eachHourOfInterval(interval2, options) {
    var _a
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    if (!(startTime <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const dates = []
    let currentDate = startDate
    currentDate.setMinutes(0, 0, 0)
    const step = (_a = options == null ? void 0 : options.step) != null ? _a : 1
    if (step < 1 || isNaN(step))
      throw new RangeError('`options.step` must be a number greater than 1')
    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate))
      currentDate = addHours(currentDate, step)
    }
    return dates
  }

  // src/startOfMinute/index.ts
  function startOfMinute(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setSeconds(0, 0)
    return date
  }

  // src/eachMinuteOfInterval/index.ts
  function eachMinuteOfInterval(interval2, options) {
    var _a
    const startDate = startOfMinute(toDate(interval2.start))
    const endDate = toDate(interval2.end)
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    if (startTime >= endTime) {
      throw new RangeError('Invalid interval')
    }
    const dates = []
    let currentDate = startDate
    const step = (_a = options == null ? void 0 : options.step) != null ? _a : 1
    if (step < 1 || isNaN(step))
      throw new RangeError(
        '`options.step` must be a number equal to or greater than 1'
      )
    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate))
      currentDate = addMinutes(currentDate, step)
    }
    return dates
  }

  // src/eachMonthOfInterval/index.ts
  function eachMonthOfInterval(interval2) {
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    const endTime = endDate.getTime()
    const dates = []
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const currentDate = startDate
    currentDate.setHours(0, 0, 0, 0)
    currentDate.setDate(1)
    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate))
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
    return dates
  }

  // src/startOfQuarter/index.ts
  function startOfQuarter(dirtyDate) {
    const date = toDate(dirtyDate)
    const currentMonth = date.getMonth()
    const month = currentMonth - (currentMonth % 3)
    date.setMonth(month, 1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/eachQuarterOfInterval/index.ts
  function eachQuarterOfInterval(interval2) {
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    let endTime = endDate.getTime()
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const startDateQuarter = startOfQuarter(startDate)
    const endDateQuarter = startOfQuarter(endDate)
    endTime = endDateQuarter.getTime()
    const quarters = []
    let currentQuarter = startDateQuarter
    while (currentQuarter.getTime() <= endTime) {
      quarters.push(toDate(currentQuarter))
      currentQuarter = addQuarters(currentQuarter, 1)
    }
    return quarters
  }

  // src/eachWeekOfInterval/index.ts
  function eachWeekOfInterval(interval2, options) {
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    let endTime = endDate.getTime()
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const startDateWeek = startOfWeek(startDate, options)
    const endDateWeek = startOfWeek(endDate, options)
    startDateWeek.setHours(15)
    endDateWeek.setHours(15)
    endTime = endDateWeek.getTime()
    const weeks = []
    let currentWeek = startDateWeek
    while (currentWeek.getTime() <= endTime) {
      currentWeek.setHours(0)
      weeks.push(toDate(currentWeek))
      currentWeek = addWeeks(currentWeek, 1)
      currentWeek.setHours(15)
    }
    return weeks
  }

  // src/eachWeekendOfInterval/index.ts
  function eachWeekendOfInterval(interval2) {
    const dateInterval = eachDayOfInterval(interval2)
    const weekends = []
    let index = 0
    while (index < dateInterval.length) {
      const date = dateInterval[index++]
      if (isWeekend(date)) {
        weekends.push(date)
        if (isSunday(date)) index = index + 5
      }
    }
    return weekends
  }

  // src/startOfMonth/index.ts
  function startOfMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/eachWeekendOfMonth/index.ts
  function eachWeekendOfMonth(dirtyDate) {
    const startDate = startOfMonth(dirtyDate)
    if (isNaN(startDate.getTime()))
      throw new RangeError('The passed date is invalid')
    const endDate = endOfMonth(dirtyDate)
    return eachWeekendOfInterval({ start: startDate, end: endDate })
  }

  // src/endOfYear/index.ts
  function endOfYear(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    date.setFullYear(year + 1, 0, 0)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/startOfYear/index.ts
  function startOfYear(dirtyDate) {
    const cleanDate = toDate(dirtyDate)
    const date = constructFrom(dirtyDate, 0)
    date.setFullYear(cleanDate.getFullYear(), 0, 1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/eachWeekendOfYear/index.ts
  function eachWeekendOfYear(dirtyDate) {
    const startDate = startOfYear(dirtyDate)
    const endDate = endOfYear(dirtyDate)
    return eachWeekendOfInterval({ start: startDate, end: endDate })
  }

  // src/eachYearOfInterval/index.ts
  function eachYearOfInterval(interval2) {
    const startDate = toDate(interval2.start)
    const endDate = toDate(interval2.end)
    const endTime = endDate.getTime()
    if (!(startDate.getTime() <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    const dates = []
    const currentDate = startDate
    currentDate.setHours(0, 0, 0, 0)
    currentDate.setMonth(0, 1)
    while (currentDate.getTime() <= endTime) {
      dates.push(toDate(currentDate))
      currentDate.setFullYear(currentDate.getFullYear() + 1)
    }
    return dates
  }

  // src/endOfDecade/index.ts
  function endOfDecade(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const decade = 9 + Math.floor(year / 10) * 10
    date.setFullYear(decade, 11, 31)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/endOfHour/index.ts
  function endOfHour(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setMinutes(59, 59, 999)
    return date
  }

  // src/endOfWeek/index.ts
  function endOfWeek(dirtyDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const weekStartsOn =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.weekStartsOn) != null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.weekStartsOn) != null
            ? _d
            : defaultOptions2.weekStartsOn) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.weekStartsOn) != null
        ? _h
        : 0
    const date = toDate(dirtyDate)
    const day = date.getDay()
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)
    date.setDate(date.getDate() + diff)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/endOfISOWeek/index.ts
  function endOfISOWeek(dirtyDate) {
    return endOfWeek(dirtyDate, { weekStartsOn: 1 })
  }

  // src/endOfISOWeekYear/index.ts
  function endOfISOWeekYear(dirtyDate) {
    const year = getISOWeekYear(dirtyDate)
    const fourthOfJanuaryOfNextYear = constructFrom(dirtyDate, 0)
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4)
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0)
    const date = startOfISOWeek(fourthOfJanuaryOfNextYear)
    date.setMilliseconds(date.getMilliseconds() - 1)
    return date
  }

  // src/endOfMinute/index.ts
  function endOfMinute(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setSeconds(59, 999)
    return date
  }

  // src/endOfQuarter/index.ts
  function endOfQuarter(dirtyDate) {
    const date = toDate(dirtyDate)
    const currentMonth = date.getMonth()
    const month = currentMonth - (currentMonth % 3) + 3
    date.setMonth(month, 0)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/endOfSecond/index.ts
  function endOfSecond(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setMilliseconds(999)
    return date
  }

  // src/endOfToday/index.ts
  function endOfToday() {
    return endOfDay(Date.now())
  }

  // src/endOfTomorrow/index.ts
  function endOfTomorrow() {
    const now = /* @__PURE__ */ new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const date = /* @__PURE__ */ new Date(0)
    date.setFullYear(year, month, day + 1)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/endOfYesterday/index.ts
  function endOfYesterday() {
    const now = /* @__PURE__ */ new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const date = /* @__PURE__ */ new Date(0)
    date.setFullYear(year, month, day - 1)
    date.setHours(23, 59, 59, 999)
    return date
  }

  // src/locale/en-US/_lib/formatDistance/index.ts
  var formatDistanceLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds',
    },
    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds',
    },
    halfAMinute: 'half a minute',
    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes',
    },
    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes',
    },
    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours',
    },
    xHours: {
      one: '1 hour',
      other: '{{count}} hours',
    },
    xDays: {
      one: '1 day',
      other: '{{count}} days',
    },
    aboutXWeeks: {
      one: 'about 1 week',
      other: 'about {{count}} weeks',
    },
    xWeeks: {
      one: '1 week',
      other: '{{count}} weeks',
    },
    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months',
    },
    xMonths: {
      one: '1 month',
      other: '{{count}} months',
    },
    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years',
    },
    xYears: {
      one: '1 year',
      other: '{{count}} years',
    },
    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years',
    },
    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years',
    },
  }
  var formatDistance = (token, count, options) => {
    let result
    const tokenValue = formatDistanceLocale[token]
    if (typeof tokenValue === 'string') {
      result = tokenValue
    } else if (count === 1) {
      result = tokenValue.one
    } else {
      result = tokenValue.other.replace('{{count}}', count.toString())
    }
    if (options == null ? void 0 : options.addSuffix) {
      if (options.comparison && options.comparison > 0) {
        return 'in ' + result
      } else {
        return result + ' ago'
      }
    }
    return result
  }
  var formatDistance_default = formatDistance

  // src/locale/_lib/buildFormatLongFn/index.ts
  function buildFormatLongFn(args) {
    return (options = {}) => {
      const width = options.width ? String(options.width) : args.defaultWidth
      const format2 = args.formats[width] || args.formats[args.defaultWidth]
      return format2
    }
  }

  // src/locale/en-US/_lib/formatLong/index.ts
  var dateFormats = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy',
  }
  var timeFormats = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a',
  }
  var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}',
  }
  var formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: 'full',
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: 'full',
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: 'full',
    }),
  }
  var formatLong_default = formatLong

  // src/locale/en-US/_lib/formatRelative/index.ts
  var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P',
  }
  var formatRelative = (token, _date, _baseDate, _options) =>
    formatRelativeLocale[token]
  var formatRelative_default = formatRelative

  // src/locale/_lib/buildLocalizeFn/index.ts
  function buildLocalizeFn(args) {
    return (dirtyIndex, options) => {
      const context = (options == null ? void 0 : options.context)
        ? String(options.context)
        : 'standalone'
      let valuesArray
      if (context === 'formatting' && args.formattingValues) {
        const defaultWidth = args.defaultFormattingWidth || args.defaultWidth
        const width = (options == null ? void 0 : options.width)
          ? String(options.width)
          : defaultWidth
        valuesArray =
          args.formattingValues[width] || args.formattingValues[defaultWidth]
      } else {
        const defaultWidth = args.defaultWidth
        const width = (options == null ? void 0 : options.width)
          ? String(options.width)
          : args.defaultWidth
        valuesArray = args.values[width] || args.values[defaultWidth]
      }
      const index = args.argumentCallback
        ? args.argumentCallback(dirtyIndex)
        : dirtyIndex
      return valuesArray[index]
    }
  }

  // src/locale/en-US/_lib/localize/index.ts
  var eraValues = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini'],
  }
  var quarterValues = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  }
  var monthValues = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    wide: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }
  var dayValues = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  }
  var dayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night',
    },
  }
  var formattingDayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
  }
  var ordinalNumber = (dirtyNumber, _options) => {
    const number = Number(dirtyNumber)
    const rem100 = number % 100
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st'
        case 2:
          return number + 'nd'
        case 3:
          return number + 'rd'
      }
    }
    return number + 'th'
  }
  var localize = {
    ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: 'wide',
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: 'wide',
      argumentCallback: (quarter) => quarter - 1,
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide',
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide',
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: 'wide',
    }),
  }
  var localize_default = localize

  // src/locale/_lib/buildMatchFn/index.ts
  function buildMatchFn(args) {
    return (string, options = {}) => {
      const width = options.width
      const matchPattern =
        (width && args.matchPatterns[width]) ||
        args.matchPatterns[args.defaultMatchWidth]
      const matchResult = string.match(matchPattern)
      if (!matchResult) {
        return null
      }
      const matchedString = matchResult[0]
      const parsePatterns =
        (width && args.parsePatterns[width]) ||
        args.parsePatterns[args.defaultParseWidth]
      const key = Array.isArray(parsePatterns)
        ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
        : findKey(parsePatterns, (pattern) => pattern.test(matchedString))
      let value
      value = args.valueCallback ? args.valueCallback(key) : key
      value = options.valueCallback ? options.valueCallback(value) : value
      const rest = string.slice(matchedString.length)
      return { value, rest }
    }
  }
  function findKey(object, predicate) {
    for (const key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key
      }
    }
    return void 0
  }
  function findIndex(array, predicate) {
    for (let key = 0; key < array.length; key++) {
      if (predicate(array[key])) {
        return key
      }
    }
    return void 0
  }

  // src/locale/_lib/buildMatchPatternFn/index.ts
  function buildMatchPatternFn(args) {
    return (string, options = {}) => {
      const matchResult = string.match(args.matchPattern)
      if (!matchResult) return null
      const matchedString = matchResult[0]
      const parseResult = string.match(args.parsePattern)
      if (!parseResult) return null
      let value = args.valueCallback
        ? args.valueCallback(parseResult[0])
        : parseResult[0]
      value = options.valueCallback ? options.valueCallback(value) : value
      const rest = string.slice(matchedString.length)
      return { value, rest }
    }
  }

  // src/locale/en-US/_lib/match/index.ts
  var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i
  var parseOrdinalNumberPattern = /\d+/i
  var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  }
  var parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i],
  }
  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  }
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i],
  }
  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  }
  var parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  }
  var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  }
  var parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  }
  var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  }
  var parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  }
  var match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (value) => parseInt(value, 10),
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns,
      defaultParseWidth: 'any',
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: 'any',
      valueCallback: (index) => index + 1,
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: 'any',
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns,
      defaultParseWidth: 'any',
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: 'any',
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: 'any',
    }),
  }
  var match_default = match

  // src/locale/en-US/index.ts
  var locale = {
    code: 'en-US',
    formatDistance: formatDistance_default,
    formatLong: formatLong_default,
    formatRelative: formatRelative_default,
    localize: localize_default,
    match: match_default,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1,
    },
  }
  var en_US_default = locale

  // src/_lib/defaultLocale/index.ts
  var defaultLocale_default = en_US_default

  // src/getDayOfYear/index.ts
  function getDayOfYear(dirtyDate) {
    const date = toDate(dirtyDate)
    const diff = differenceInCalendarDays(date, startOfYear(date))
    const dayOfYear = diff + 1
    return dayOfYear
  }

  // src/getISOWeek/index.ts
  function getISOWeek(dirtyDate) {
    const date = toDate(dirtyDate)
    const diff =
      startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime()
    return Math.round(diff / millisecondsInWeek) + 1
  }

  // src/getWeekYear/index.ts
  function getWeekYear(dirtyDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const defaultOptions2 = getDefaultOptions()
    const firstWeekContainsDate =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.firstWeekContainsDate) !=
            null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.firstWeekContainsDate) != null
            ? _d
            : defaultOptions2.firstWeekContainsDate) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.firstWeekContainsDate) != null
        ? _h
        : 1
    const firstWeekOfNextYear = constructFrom(dirtyDate, 0)
    firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate)
    firstWeekOfNextYear.setHours(0, 0, 0, 0)
    const startOfNextYear = startOfWeek(firstWeekOfNextYear, options)
    const firstWeekOfThisYear = constructFrom(dirtyDate, 0)
    firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate)
    firstWeekOfThisYear.setHours(0, 0, 0, 0)
    const startOfThisYear = startOfWeek(firstWeekOfThisYear, options)
    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  // src/startOfWeekYear/index.ts
  function startOfWeekYear(dirtyDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const firstWeekContainsDate =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.firstWeekContainsDate) !=
            null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.firstWeekContainsDate) != null
            ? _d
            : defaultOptions2.firstWeekContainsDate) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.firstWeekContainsDate) != null
        ? _h
        : 1
    const year = getWeekYear(dirtyDate, options)
    const firstWeek = constructFrom(dirtyDate, 0)
    firstWeek.setFullYear(year, 0, firstWeekContainsDate)
    firstWeek.setHours(0, 0, 0, 0)
    const date = startOfWeek(firstWeek, options)
    return date
  }

  // src/getWeek/index.ts
  function getWeek(dirtyDate, options) {
    const date = toDate(dirtyDate)
    const diff =
      startOfWeek(date, options).getTime() -
      startOfWeekYear(date, options).getTime()
    return Math.round(diff / millisecondsInWeek) + 1
  }

  // src/_lib/addLeadingZeros/index.ts
  function addLeadingZeros(number, targetLength) {
    const sign = number < 0 ? '-' : ''
    let output = Math.abs(number).toString()
    while (output.length < targetLength) {
      output = '0' + output
    }
    return sign + output
  }

  // src/_lib/format/lightFormatters/index.ts
  var formatters = {
    // Year
    y(date, token) {
      const signedYear = date.getFullYear()
      const year = signedYear > 0 ? signedYear : 1 - signedYear
      return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length)
    },
    // Month
    M(date, token) {
      const month = date.getMonth()
      return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2)
    },
    // Day of the month
    d(date, token) {
      return addLeadingZeros(date.getDate(), token.length)
    },
    // AM or PM
    a(date, token) {
      const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? 'pm' : 'am'
      switch (token) {
        case 'a':
        case 'aa':
          return dayPeriodEnumValue.toUpperCase()
        case 'aaa':
          return dayPeriodEnumValue
        case 'aaaaa':
          return dayPeriodEnumValue[0]
        case 'aaaa':
        default:
          return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.'
      }
    },
    // Hour [1-12]
    h(date, token) {
      return addLeadingZeros(date.getHours() % 12 || 12, token.length)
    },
    // Hour [0-23]
    H(date, token) {
      return addLeadingZeros(date.getHours(), token.length)
    },
    // Minute
    m(date, token) {
      return addLeadingZeros(date.getMinutes(), token.length)
    },
    // Second
    s(date, token) {
      return addLeadingZeros(date.getSeconds(), token.length)
    },
    // Fraction of second
    S(date, token) {
      const numberOfDigits = token.length
      const milliseconds2 = date.getMilliseconds()
      const fractionalSeconds = Math.floor(
        milliseconds2 * Math.pow(10, numberOfDigits - 3)
      )
      return addLeadingZeros(fractionalSeconds, token.length)
    },
  }
  var lightFormatters_default = formatters

  // src/_lib/format/formatters/index.ts
  var dayPeriodEnum = {
    am: 'am',
    pm: 'pm',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night',
  }
  var formatters2 = {
    // Era
    G: function (date, token, localize2) {
      const era = date.getFullYear() > 0 ? 1 : 0
      switch (token) {
        case 'G':
        case 'GG':
        case 'GGG':
          return localize2.era(era, { width: 'abbreviated' })
        case 'GGGGG':
          return localize2.era(era, { width: 'narrow' })
        case 'GGGG':
        default:
          return localize2.era(era, { width: 'wide' })
      }
    },
    // Year
    y: function (date, token, localize2) {
      if (token === 'yo') {
        const signedYear = date.getFullYear()
        const year = signedYear > 0 ? signedYear : 1 - signedYear
        return localize2.ordinalNumber(year, { unit: 'year' })
      }
      return lightFormatters_default.y(date, token)
    },
    // Local week-numbering year
    Y: function (date, token, localize2, options) {
      const signedWeekYear = getWeekYear(date, options)
      const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear
      if (token === 'YY') {
        const twoDigitYear = weekYear % 100
        return addLeadingZeros(twoDigitYear, 2)
      }
      if (token === 'Yo') {
        return localize2.ordinalNumber(weekYear, { unit: 'year' })
      }
      return addLeadingZeros(weekYear, token.length)
    },
    // ISO week-numbering year
    R: function (date, token) {
      const isoWeekYear = getISOWeekYear(date)
      return addLeadingZeros(isoWeekYear, token.length)
    },
    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function (date, token) {
      const year = date.getFullYear()
      return addLeadingZeros(year, token.length)
    },
    // Quarter
    Q: function (date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3)
      switch (token) {
        case 'Q':
          return String(quarter)
        case 'QQ':
          return addLeadingZeros(quarter, 2)
        case 'Qo':
          return localize2.ordinalNumber(quarter, { unit: 'quarter' })
        case 'QQQ':
          return localize2.quarter(quarter, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'QQQQQ':
          return localize2.quarter(quarter, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'QQQQ':
        default:
          return localize2.quarter(quarter, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone quarter
    q: function (date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3)
      switch (token) {
        case 'q':
          return String(quarter)
        case 'qq':
          return addLeadingZeros(quarter, 2)
        case 'qo':
          return localize2.ordinalNumber(quarter, { unit: 'quarter' })
        case 'qqq':
          return localize2.quarter(quarter, {
            width: 'abbreviated',
            context: 'standalone',
          })
        case 'qqqqq':
          return localize2.quarter(quarter, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'qqqq':
        default:
          return localize2.quarter(quarter, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // Month
    M: function (date, token, localize2) {
      const month = date.getMonth()
      switch (token) {
        case 'M':
        case 'MM':
          return lightFormatters_default.M(date, token)
        case 'Mo':
          return localize2.ordinalNumber(month + 1, { unit: 'month' })
        case 'MMM':
          return localize2.month(month, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'MMMMM':
          return localize2.month(month, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'MMMM':
        default:
          return localize2.month(month, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone month
    L: function (date, token, localize2) {
      const month = date.getMonth()
      switch (token) {
        case 'L':
          return String(month + 1)
        case 'LL':
          return addLeadingZeros(month + 1, 2)
        case 'Lo':
          return localize2.ordinalNumber(month + 1, { unit: 'month' })
        case 'LLL':
          return localize2.month(month, {
            width: 'abbreviated',
            context: 'standalone',
          })
        case 'LLLLL':
          return localize2.month(month, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'LLLL':
        default:
          return localize2.month(month, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // Local week of year
    w: function (date, token, localize2, options) {
      const week = getWeek(date, options)
      if (token === 'wo') {
        return localize2.ordinalNumber(week, { unit: 'week' })
      }
      return addLeadingZeros(week, token.length)
    },
    // ISO week of year
    I: function (date, token, localize2) {
      const isoWeek = getISOWeek(date)
      if (token === 'Io') {
        return localize2.ordinalNumber(isoWeek, { unit: 'week' })
      }
      return addLeadingZeros(isoWeek, token.length)
    },
    // Day of the month
    d: function (date, token, localize2) {
      if (token === 'do') {
        return localize2.ordinalNumber(date.getDate(), { unit: 'date' })
      }
      return lightFormatters_default.d(date, token)
    },
    // Day of year
    D: function (date, token, localize2) {
      const dayOfYear = getDayOfYear(date)
      if (token === 'Do') {
        return localize2.ordinalNumber(dayOfYear, { unit: 'dayOfYear' })
      }
      return addLeadingZeros(dayOfYear, token.length)
    },
    // Day of week
    E: function (date, token, localize2) {
      const dayOfWeek = date.getDay()
      switch (token) {
        case 'E':
        case 'EE':
        case 'EEE':
          return localize2.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'EEEEE':
          return localize2.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'EEEEEE':
          return localize2.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        case 'EEEE':
        default:
          return localize2.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Local day of week
    e: function (date, token, localize2, options) {
      const dayOfWeek = date.getDay()
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7
      switch (token) {
        case 'e':
          return String(localDayOfWeek)
        case 'ee':
          return addLeadingZeros(localDayOfWeek, 2)
        case 'eo':
          return localize2.ordinalNumber(localDayOfWeek, { unit: 'day' })
        case 'eee':
          return localize2.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'eeeee':
          return localize2.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'eeeeee':
          return localize2.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        case 'eeee':
        default:
          return localize2.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Stand-alone local day of week
    c: function (date, token, localize2, options) {
      const dayOfWeek = date.getDay()
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7
      switch (token) {
        case 'c':
          return String(localDayOfWeek)
        case 'cc':
          return addLeadingZeros(localDayOfWeek, token.length)
        case 'co':
          return localize2.ordinalNumber(localDayOfWeek, { unit: 'day' })
        case 'ccc':
          return localize2.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'standalone',
          })
        case 'ccccc':
          return localize2.day(dayOfWeek, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'cccccc':
          return localize2.day(dayOfWeek, {
            width: 'short',
            context: 'standalone',
          })
        case 'cccc':
        default:
          return localize2.day(dayOfWeek, {
            width: 'wide',
            context: 'standalone',
          })
      }
    },
    // ISO day of week
    i: function (date, token, localize2) {
      const dayOfWeek = date.getDay()
      const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek
      switch (token) {
        case 'i':
          return String(isoDayOfWeek)
        case 'ii':
          return addLeadingZeros(isoDayOfWeek, token.length)
        case 'io':
          return localize2.ordinalNumber(isoDayOfWeek, { unit: 'day' })
        case 'iii':
          return localize2.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'iiiii':
          return localize2.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'iiiiii':
          return localize2.day(dayOfWeek, {
            width: 'short',
            context: 'formatting',
          })
        case 'iiii':
        default:
          return localize2.day(dayOfWeek, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // AM or PM
    a: function (date, token, localize2) {
      const hours = date.getHours()
      const dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am'
      switch (token) {
        case 'a':
        case 'aa':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'aaa':
          return localize2
            .dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting',
            })
            .toLowerCase()
        case 'aaaaa':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'aaaa':
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // AM, PM, midnight, noon
    b: function (date, token, localize2) {
      const hours = date.getHours()
      let dayPeriodEnumValue
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am'
      }
      switch (token) {
        case 'b':
        case 'bb':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'bbb':
          return localize2
            .dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting',
            })
            .toLowerCase()
        case 'bbbbb':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'bbbb':
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // in the morning, in the afternoon, in the evening, at night
    B: function (date, token, localize2) {
      const hours = date.getHours()
      let dayPeriodEnumValue
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night
      }
      switch (token) {
        case 'B':
        case 'BB':
        case 'BBB':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting',
          })
        case 'BBBBB':
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'BBBB':
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting',
          })
      }
    },
    // Hour [1-12]
    h: function (date, token, localize2) {
      if (token === 'ho') {
        let hours = date.getHours() % 12
        if (hours === 0) hours = 12
        return localize2.ordinalNumber(hours, { unit: 'hour' })
      }
      return lightFormatters_default.h(date, token)
    },
    // Hour [0-23]
    H: function (date, token, localize2) {
      if (token === 'Ho') {
        return localize2.ordinalNumber(date.getHours(), { unit: 'hour' })
      }
      return lightFormatters_default.H(date, token)
    },
    // Hour [0-11]
    K: function (date, token, localize2) {
      const hours = date.getHours() % 12
      if (token === 'Ko') {
        return localize2.ordinalNumber(hours, { unit: 'hour' })
      }
      return addLeadingZeros(hours, token.length)
    },
    // Hour [1-24]
    k: function (date, token, localize2) {
      let hours = date.getHours()
      if (hours === 0) hours = 24
      if (token === 'ko') {
        return localize2.ordinalNumber(hours, { unit: 'hour' })
      }
      return addLeadingZeros(hours, token.length)
    },
    // Minute
    m: function (date, token, localize2) {
      if (token === 'mo') {
        return localize2.ordinalNumber(date.getMinutes(), { unit: 'minute' })
      }
      return lightFormatters_default.m(date, token)
    },
    // Second
    s: function (date, token, localize2) {
      if (token === 'so') {
        return localize2.ordinalNumber(date.getSeconds(), { unit: 'second' })
      }
      return lightFormatters_default.s(date, token)
    },
    // Fraction of second
    S: function (date, token) {
      return lightFormatters_default.S(date, token)
    },
    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timezoneOffset = originalDate.getTimezoneOffset()
      if (timezoneOffset === 0) {
        return 'Z'
      }
      switch (token) {
        case 'X':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)
        case 'XXXX':
        case 'XX':
          return formatTimezone(timezoneOffset)
        case 'XXXXX':
        case 'XXX':
        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timezoneOffset = originalDate.getTimezoneOffset()
      switch (token) {
        case 'x':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)
        case 'xxxx':
        case 'xx':
          return formatTimezone(timezoneOffset)
        case 'xxxxx':
        case 'xxx':
        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (GMT)
    O: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timezoneOffset = originalDate.getTimezoneOffset()
      switch (token) {
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        case 'OOOO':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },
    // Timezone (specific non-location)
    z: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timezoneOffset = originalDate.getTimezoneOffset()
      switch (token) {
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        case 'zzzz':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },
    // Seconds timestamp
    t: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timestamp = Math.floor(originalDate.getTime() / 1e3)
      return addLeadingZeros(timestamp, token.length)
    },
    // Milliseconds timestamp
    T: function (date, token, _localize, options) {
      const originalDate = options._originalDate || date
      const timestamp = originalDate.getTime()
      return addLeadingZeros(timestamp, token.length)
    },
  }
  function formatTimezoneShort(offset, delimiter = '') {
    const sign = offset > 0 ? '-' : '+'
    const absOffset = Math.abs(offset)
    const hours = Math.floor(absOffset / 60)
    const minutes = absOffset % 60
    if (minutes === 0) {
      return sign + String(hours)
    }
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2)
  }
  function formatTimezoneWithOptionalMinutes(offset, delimiter) {
    if (offset % 60 === 0) {
      const sign = offset > 0 ? '-' : '+'
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2)
    }
    return formatTimezone(offset, delimiter)
  }
  function formatTimezone(offset, delimiter = '') {
    const sign = offset > 0 ? '-' : '+'
    const absOffset = Math.abs(offset)
    const hours = addLeadingZeros(Math.floor(absOffset / 60), 2)
    const minutes = addLeadingZeros(absOffset % 60, 2)
    return sign + hours + delimiter + minutes
  }
  var formatters_default = formatters2

  // src/_lib/format/longFormatters/index.ts
  var dateLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case 'P':
        return formatLong2.date({ width: 'short' })
      case 'PP':
        return formatLong2.date({ width: 'medium' })
      case 'PPP':
        return formatLong2.date({ width: 'long' })
      case 'PPPP':
      default:
        return formatLong2.date({ width: 'full' })
    }
  }
  var timeLongFormatter = (pattern, formatLong2) => {
    switch (pattern) {
      case 'p':
        return formatLong2.time({ width: 'short' })
      case 'pp':
        return formatLong2.time({ width: 'medium' })
      case 'ppp':
        return formatLong2.time({ width: 'long' })
      case 'pppp':
      default:
        return formatLong2.time({ width: 'full' })
    }
  }
  var dateTimeLongFormatter = (pattern, formatLong2) => {
    const matchResult = pattern.match(/(P+)(p+)?/) || []
    const datePattern = matchResult[1]
    const timePattern = matchResult[2]
    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong2)
    }
    let dateTimeFormat
    switch (datePattern) {
      case 'P':
        dateTimeFormat = formatLong2.dateTime({ width: 'short' })
        break
      case 'PP':
        dateTimeFormat = formatLong2.dateTime({ width: 'medium' })
        break
      case 'PPP':
        dateTimeFormat = formatLong2.dateTime({ width: 'long' })
        break
      case 'PPPP':
      default:
        dateTimeFormat = formatLong2.dateTime({ width: 'full' })
        break
    }
    return dateTimeFormat
      .replace('{{date}}', dateLongFormatter(datePattern, formatLong2))
      .replace('{{time}}', timeLongFormatter(timePattern, formatLong2))
  }
  var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter,
  }
  var longFormatters_default = longFormatters

  // src/_lib/protectedTokens/index.ts
  var protectedDayOfYearTokens = ['D', 'DD']
  var protectedWeekYearTokens = ['YY', 'YYYY']
  function isProtectedDayOfYearToken(token) {
    return protectedDayOfYearTokens.indexOf(token) !== -1
  }
  function isProtectedWeekYearToken(token) {
    return protectedWeekYearTokens.indexOf(token) !== -1
  }
  function throwProtectedError(token, format2, input) {
    if (token === 'YYYY') {
      throw new RangeError(
        `Use \`yyyy\` instead of \`YYYY\` (in \`${format2}\`) for formatting years to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
      )
    } else if (token === 'YY') {
      throw new RangeError(
        `Use \`yy\` instead of \`YY\` (in \`${format2}\`) for formatting years to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
      )
    } else if (token === 'D') {
      throw new RangeError(
        `Use \`d\` instead of \`D\` (in \`${format2}\`) for formatting days of the month to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
      )
    } else if (token === 'DD') {
      throw new RangeError(
        `Use \`dd\` instead of \`DD\` (in \`${format2}\`) for formatting days of the month to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`
      )
    }
  }

  // src/format/index.ts
  var formattingTokensRegExp =
    /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
  var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g
  var escapedStringRegExp = /^'([^]*?)'?$/
  var doubleQuoteRegExp = /''/g
  var unescapedLatinCharacterRegExp = /[a-zA-Z]/
  function format(dirtyDate, formatStr, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r
    const defaultOptions2 = getDefaultOptions()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : defaultLocale_default
    const firstWeekContainsDate =
      (_j =
        (_i =
          (_f =
            (_e = options == null ? void 0 : options.firstWeekContainsDate) !=
            null
              ? _e
              : (_d =
                  (_c = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _c.options) == null
              ? void 0
              : _d.firstWeekContainsDate) != null
            ? _f
            : defaultOptions2.firstWeekContainsDate) != null
          ? _i
          : (_h =
              (_g = defaultOptions2.locale) == null ? void 0 : _g.options) ==
            null
          ? void 0
          : _h.firstWeekContainsDate) != null
        ? _j
        : 1
    const weekStartsOn =
      (_r =
        (_q =
          (_n =
            (_m = options == null ? void 0 : options.weekStartsOn) != null
              ? _m
              : (_l =
                  (_k = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _k.options) == null
              ? void 0
              : _l.weekStartsOn) != null
            ? _n
            : defaultOptions2.weekStartsOn) != null
          ? _q
          : (_p =
              (_o = defaultOptions2.locale) == null ? void 0 : _o.options) ==
            null
          ? void 0
          : _p.weekStartsOn) != null
        ? _r
        : 0
    if (!locale2.localize) {
      throw new RangeError('locale must contain localize property')
    }
    if (!locale2.formatLong) {
      throw new RangeError('locale must contain formatLong property')
    }
    const originalDate = toDate(dirtyDate)
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }
    const formatterOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale: locale2,
      _originalDate: originalDate,
    }
    const result = formatStr
      .match(longFormattingTokensRegExp)
      .map(function (substring) {
        const firstCharacter = substring[0]
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          const longFormatter = longFormatters_default[firstCharacter]
          return longFormatter(substring, locale2.formatLong)
        }
        return substring
      })
      .join('')
      .match(formattingTokensRegExp)
      .map(function (substring) {
        if (substring === "''") {
          return "'"
        }
        const firstCharacter = substring[0]
        if (firstCharacter === "'") {
          return cleanEscapedString(substring)
        }
        const formatter = formatters_default[firstCharacter]
        if (formatter) {
          if (
            !(options == null ? void 0 : options.useAdditionalWeekYearTokens) &&
            isProtectedWeekYearToken(substring)
          ) {
            throwProtectedError(substring, formatStr, String(dirtyDate))
          }
          if (
            !(options == null
              ? void 0
              : options.useAdditionalDayOfYearTokens) &&
            isProtectedDayOfYearToken(substring)
          ) {
            throwProtectedError(substring, formatStr, String(dirtyDate))
          }
          return formatter(
            originalDate,
            substring,
            locale2.localize,
            formatterOptions
          )
        }
        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError(
            'Format string contains an unescaped latin alphabet character `' +
              firstCharacter +
              '`'
          )
        }
        return substring
      })
      .join('')
    return result
  }
  function cleanEscapedString(input) {
    const matched = input.match(escapedStringRegExp)
    if (!matched) {
      return input
    }
    return matched[1].replace(doubleQuoteRegExp, "'")
  }

  // src/_lib/assign/index.ts
  function assign(target, object) {
    if (target == null) {
      throw new TypeError(
        'assign requires that input parameter not be null or undefined'
      )
    }
    for (const property in object) {
      if (Object.prototype.hasOwnProperty.call(object, property)) {
        target[property] = object[property]
      }
    }
    return target
  }

  // src/_lib/cloneObject/index.ts
  function cloneObject(object) {
    return assign({}, object)
  }

  // src/formatDistance/index.ts
  function formatDistance2(dirtyDate, dirtyBaseDate, options) {
    var _a, _b
    const defaultOptions2 = getDefaultOptions()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : defaultLocale_default
    const minutesInAlmostTwoDays = 2520
    if (!locale2.formatDistance) {
      throw new RangeError('locale must contain formatDistance property')
    }
    const comparison = compareAsc(dirtyDate, dirtyBaseDate)
    if (isNaN(comparison)) {
      throw new RangeError('Invalid time value')
    }
    const localizeOptions = assign(cloneObject(options), {
      addSuffix: options == null ? void 0 : options.addSuffix,
      comparison,
    })
    let dateLeft
    let dateRight
    if (comparison > 0) {
      dateLeft = toDate(dirtyBaseDate)
      dateRight = toDate(dirtyDate)
    } else {
      dateLeft = toDate(dirtyDate)
      dateRight = toDate(dirtyBaseDate)
    }
    const seconds = differenceInSeconds(dateRight, dateLeft)
    const offsetInSeconds =
      (getTimezoneOffsetInMilliseconds(dateRight) -
        getTimezoneOffsetInMilliseconds(dateLeft)) /
      1e3
    const minutes = Math.round((seconds - offsetInSeconds) / 60)
    let months2
    if (minutes < 2) {
      if (options == null ? void 0 : options.includeSeconds) {
        if (seconds < 5) {
          return locale2.formatDistance('lessThanXSeconds', 5, localizeOptions)
        } else if (seconds < 10) {
          return locale2.formatDistance('lessThanXSeconds', 10, localizeOptions)
        } else if (seconds < 20) {
          return locale2.formatDistance('lessThanXSeconds', 20, localizeOptions)
        } else if (seconds < 40) {
          return locale2.formatDistance('halfAMinute', 0, localizeOptions)
        } else if (seconds < 60) {
          return locale2.formatDistance('lessThanXMinutes', 1, localizeOptions)
        } else {
          return locale2.formatDistance('xMinutes', 1, localizeOptions)
        }
      } else {
        if (minutes === 0) {
          return locale2.formatDistance('lessThanXMinutes', 1, localizeOptions)
        } else {
          return locale2.formatDistance('xMinutes', minutes, localizeOptions)
        }
      }
    } else if (minutes < 45) {
      return locale2.formatDistance('xMinutes', minutes, localizeOptions)
    } else if (minutes < 90) {
      return locale2.formatDistance('aboutXHours', 1, localizeOptions)
    } else if (minutes < minutesInDay) {
      const hours = Math.round(minutes / 60)
      return locale2.formatDistance('aboutXHours', hours, localizeOptions)
    } else if (minutes < minutesInAlmostTwoDays) {
      return locale2.formatDistance('xDays', 1, localizeOptions)
    } else if (minutes < minutesInMonth) {
      const days2 = Math.round(minutes / minutesInDay)
      return locale2.formatDistance('xDays', days2, localizeOptions)
    } else if (minutes < minutesInMonth * 2) {
      months2 = Math.round(minutes / minutesInMonth)
      return locale2.formatDistance('aboutXMonths', months2, localizeOptions)
    }
    months2 = differenceInMonths(dateRight, dateLeft)
    if (months2 < 12) {
      const nearestMonth = Math.round(minutes / minutesInMonth)
      return locale2.formatDistance('xMonths', nearestMonth, localizeOptions)
    } else {
      const monthsSinceStartOfYear = months2 % 12
      const years = Math.floor(months2 / 12)
      if (monthsSinceStartOfYear < 3) {
        return locale2.formatDistance('aboutXYears', years, localizeOptions)
      } else if (monthsSinceStartOfYear < 9) {
        return locale2.formatDistance('overXYears', years, localizeOptions)
      } else {
        return locale2.formatDistance(
          'almostXYears',
          years + 1,
          localizeOptions
        )
      }
    }
  }

  // src/formatDistanceStrict/index.ts
  function formatDistanceStrict(dirtyDate, dirtyBaseDate, options) {
    var _a, _b, _c
    const defaultOptions2 = getDefaultOptions()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : defaultLocale_default
    if (!locale2.formatDistance) {
      throw new RangeError(
        'locale must contain localize.formatDistance property'
      )
    }
    const comparison = compareAsc(dirtyDate, dirtyBaseDate)
    if (isNaN(comparison)) {
      throw new RangeError('Invalid time value')
    }
    const localizeOptions = assign(cloneObject(options), {
      addSuffix: options == null ? void 0 : options.addSuffix,
      comparison,
    })
    let dateLeft
    let dateRight
    if (comparison > 0) {
      dateLeft = toDate(dirtyBaseDate)
      dateRight = toDate(dirtyDate)
    } else {
      dateLeft = toDate(dirtyDate)
      dateRight = toDate(dirtyBaseDate)
    }
    const roundingMethod = getRoundingMethod(
      (_c = options == null ? void 0 : options.roundingMethod) != null
        ? _c
        : 'round'
    )
    const milliseconds2 = dateRight.getTime() - dateLeft.getTime()
    const minutes = milliseconds2 / millisecondsInMinute
    const timezoneOffset =
      getTimezoneOffsetInMilliseconds(dateRight) -
      getTimezoneOffsetInMilliseconds(dateLeft)
    const dstNormalizedMinutes =
      (milliseconds2 - timezoneOffset) / millisecondsInMinute
    const defaultUnit = options == null ? void 0 : options.unit
    let unit
    if (!defaultUnit) {
      if (minutes < 1) {
        unit = 'second'
      } else if (minutes < 60) {
        unit = 'minute'
      } else if (minutes < minutesInDay) {
        unit = 'hour'
      } else if (dstNormalizedMinutes < minutesInMonth) {
        unit = 'day'
      } else if (dstNormalizedMinutes < minutesInYear) {
        unit = 'month'
      } else {
        unit = 'year'
      }
    } else {
      unit = defaultUnit
    }
    if (unit === 'second') {
      const seconds = roundingMethod(milliseconds2 / 1e3)
      return locale2.formatDistance('xSeconds', seconds, localizeOptions)
    } else if (unit === 'minute') {
      const roundedMinutes = roundingMethod(minutes)
      return locale2.formatDistance('xMinutes', roundedMinutes, localizeOptions)
    } else if (unit === 'hour') {
      const hours = roundingMethod(minutes / 60)
      return locale2.formatDistance('xHours', hours, localizeOptions)
    } else if (unit === 'day') {
      const days2 = roundingMethod(dstNormalizedMinutes / minutesInDay)
      return locale2.formatDistance('xDays', days2, localizeOptions)
    } else if (unit === 'month') {
      const months2 = roundingMethod(dstNormalizedMinutes / minutesInMonth)
      return months2 === 12 && defaultUnit !== 'month'
        ? locale2.formatDistance('xYears', 1, localizeOptions)
        : locale2.formatDistance('xMonths', months2, localizeOptions)
    } else {
      const years = roundingMethod(dstNormalizedMinutes / minutesInYear)
      return locale2.formatDistance('xYears', years, localizeOptions)
    }
  }

  // src/formatDistanceToNow/index.ts
  function formatDistanceToNow(dirtyDate, options) {
    return formatDistance2(dirtyDate, Date.now(), options)
  }

  // src/formatDistanceToNowStrict/index.ts
  function formatDistanceToNowStrict(dirtyDate, options) {
    return formatDistanceStrict(dirtyDate, Date.now(), options)
  }

  // src/formatDuration/index.ts
  var defaultFormat = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ]
  function formatDuration(duration, options) {
    var _a, _b, _c, _d, _e
    const defaultOptions2 = getDefaultOptions()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : defaultLocale_default
    const format2 =
      (_c = options == null ? void 0 : options.format) != null
        ? _c
        : defaultFormat
    const zero =
      (_d = options == null ? void 0 : options.zero) != null ? _d : false
    const delimiter =
      (_e = options == null ? void 0 : options.delimiter) != null ? _e : ' '
    if (!locale2.formatDistance) {
      return ''
    }
    const result = format2
      .reduce((acc, unit) => {
        const token = `x${unit.replace(/(^.)/, (m) => m.toUpperCase())}`
        const value = duration[unit]
        if (value !== void 0 && (zero || duration[unit])) {
          return acc.concat(locale2.formatDistance(token, value))
        }
        return acc
      }, [])
      .join(delimiter)
    return result
  }

  // src/formatISO/index.ts
  function formatISO(date, options) {
    var _a, _b
    const originalDate = toDate(date)
    if (isNaN(originalDate.getTime())) {
      throw new RangeError('Invalid time value')
    }
    const format2 =
      (_a = options == null ? void 0 : options.format) != null ? _a : 'extended'
    const representation =
      (_b = options == null ? void 0 : options.representation) != null
        ? _b
        : 'complete'
    let result = ''
    let tzOffset = ''
    const dateDelimiter = format2 === 'extended' ? '-' : ''
    const timeDelimiter = format2 === 'extended' ? ':' : ''
    if (representation !== 'time') {
      const day = addLeadingZeros(originalDate.getDate(), 2)
      const month = addLeadingZeros(originalDate.getMonth() + 1, 2)
      const year = addLeadingZeros(originalDate.getFullYear(), 4)
      result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`
    }
    if (representation !== 'date') {
      const offset = originalDate.getTimezoneOffset()
      if (offset !== 0) {
        const absoluteOffset = Math.abs(offset)
        const hourOffset = addLeadingZeros(Math.floor(absoluteOffset / 60), 2)
        const minuteOffset = addLeadingZeros(absoluteOffset % 60, 2)
        const sign = offset < 0 ? '+' : '-'
        tzOffset = `${sign}${hourOffset}:${minuteOffset}`
      } else {
        tzOffset = 'Z'
      }
      const hour = addLeadingZeros(originalDate.getHours(), 2)
      const minute = addLeadingZeros(originalDate.getMinutes(), 2)
      const second = addLeadingZeros(originalDate.getSeconds(), 2)
      const separator = result === '' ? '' : 'T'
      const time = [hour, minute, second].join(timeDelimiter)
      result = `${result}${separator}${time}${tzOffset}`
    }
    return result
  }

  // src/formatISO9075/index.ts
  function formatISO9075(dirtyDate, options) {
    var _a, _b
    const originalDate = toDate(dirtyDate)
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }
    const format2 =
      (_a = options == null ? void 0 : options.format) != null ? _a : 'extended'
    const representation =
      (_b = options == null ? void 0 : options.representation) != null
        ? _b
        : 'complete'
    let result = ''
    const dateDelimiter = format2 === 'extended' ? '-' : ''
    const timeDelimiter = format2 === 'extended' ? ':' : ''
    if (representation !== 'time') {
      const day = addLeadingZeros(originalDate.getDate(), 2)
      const month = addLeadingZeros(originalDate.getMonth() + 1, 2)
      const year = addLeadingZeros(originalDate.getFullYear(), 4)
      result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`
    }
    if (representation !== 'date') {
      const hour = addLeadingZeros(originalDate.getHours(), 2)
      const minute = addLeadingZeros(originalDate.getMinutes(), 2)
      const second = addLeadingZeros(originalDate.getSeconds(), 2)
      const separator = result === '' ? '' : ' '
      result = `${result}${separator}${hour}${timeDelimiter}${minute}${timeDelimiter}${second}`
    }
    return result
  }

  // src/formatISODuration/index.ts
  function formatISODuration(duration) {
    const {
      years = 0,
      months: months2 = 0,
      days: days2 = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = duration
    return `P${years}Y${months2}M${days2}DT${hours}H${minutes}M${seconds}S`
  }

  // src/formatRFC3339/index.ts
  function formatRFC3339(dirtyDate, options) {
    var _a
    const originalDate = toDate(dirtyDate)
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }
    const fractionDigits =
      (_a = options == null ? void 0 : options.fractionDigits) != null ? _a : 0
    const day = addLeadingZeros(originalDate.getDate(), 2)
    const month = addLeadingZeros(originalDate.getMonth() + 1, 2)
    const year = originalDate.getFullYear()
    const hour = addLeadingZeros(originalDate.getHours(), 2)
    const minute = addLeadingZeros(originalDate.getMinutes(), 2)
    const second = addLeadingZeros(originalDate.getSeconds(), 2)
    let fractionalSecond = ''
    if (fractionDigits > 0) {
      const milliseconds2 = originalDate.getMilliseconds()
      const fractionalSeconds = Math.floor(
        milliseconds2 * Math.pow(10, fractionDigits - 3)
      )
      fractionalSecond =
        '.' + addLeadingZeros(fractionalSeconds, fractionDigits)
    }
    let offset = ''
    const tzOffset = originalDate.getTimezoneOffset()
    if (tzOffset !== 0) {
      const absoluteOffset = Math.abs(tzOffset)
      const hourOffset = addLeadingZeros(Math.trunc(absoluteOffset / 60), 2)
      const minuteOffset = addLeadingZeros(absoluteOffset % 60, 2)
      const sign = tzOffset < 0 ? '+' : '-'
      offset = `${sign}${hourOffset}:${minuteOffset}`
    } else {
      offset = 'Z'
    }
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${fractionalSecond}${offset}`
  }

  // src/formatRFC7231/index.ts
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  function formatRFC7231(dirtyDate) {
    const originalDate = toDate(dirtyDate)
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }
    const dayName = days[originalDate.getUTCDay()]
    const dayOfMonth = addLeadingZeros(originalDate.getUTCDate(), 2)
    const monthName = months[originalDate.getUTCMonth()]
    const year = originalDate.getUTCFullYear()
    const hour = addLeadingZeros(originalDate.getUTCHours(), 2)
    const minute = addLeadingZeros(originalDate.getUTCMinutes(), 2)
    const second = addLeadingZeros(originalDate.getUTCSeconds(), 2)
    return `${dayName}, ${dayOfMonth} ${monthName} ${year} ${hour}:${minute}:${second} GMT`
  }

  // src/formatRelative/index.ts
  function formatRelative2(dirtyDate, dirtyBaseDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j
    const date = toDate(dirtyDate)
    const baseDate = toDate(dirtyBaseDate)
    const defaultOptions2 = getDefaultOptions()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : defaultLocale_default
    const weekStartsOn =
      (_j =
        (_i =
          (_f =
            (_e = options == null ? void 0 : options.weekStartsOn) != null
              ? _e
              : (_d =
                  (_c = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _c.options) == null
              ? void 0
              : _d.weekStartsOn) != null
            ? _f
            : defaultOptions2.weekStartsOn) != null
          ? _i
          : (_h =
              (_g = defaultOptions2.locale) == null ? void 0 : _g.options) ==
            null
          ? void 0
          : _h.weekStartsOn) != null
        ? _j
        : 0
    if (!locale2.localize) {
      throw new RangeError('locale must contain localize property')
    }
    if (!locale2.formatLong) {
      throw new RangeError('locale must contain formatLong property')
    }
    if (!locale2.formatRelative) {
      throw new RangeError('locale must contain formatRelative property')
    }
    const diff = differenceInCalendarDays(date, baseDate)
    if (isNaN(diff)) {
      throw new RangeError('Invalid time value')
    }
    let token
    if (diff < -6) {
      token = 'other'
    } else if (diff < -1) {
      token = 'lastWeek'
    } else if (diff < 0) {
      token = 'yesterday'
    } else if (diff < 1) {
      token = 'today'
    } else if (diff < 2) {
      token = 'tomorrow'
    } else if (diff < 7) {
      token = 'nextWeek'
    } else {
      token = 'other'
    }
    const formatStr = locale2.formatRelative(token, date, baseDate, {
      locale: locale2,
      weekStartsOn,
    })
    return format(date, formatStr, { locale: locale2, weekStartsOn })
  }

  // src/fromUnixTime/index.ts
  function fromUnixTime(unixTime) {
    return toDate(unixTime * 1e3)
  }

  // src/getDate/index.ts
  function getDate(dirtyDate) {
    const date = toDate(dirtyDate)
    const dayOfMonth = date.getDate()
    return dayOfMonth
  }

  // src/getDay/index.ts
  function getDay(dirtyDate) {
    const date = toDate(dirtyDate)
    const day = date.getDay()
    return day
  }

  // src/getDaysInMonth/index.ts
  function getDaysInMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const monthIndex = date.getMonth()
    const lastDayOfMonth2 = constructFrom(dirtyDate, 0)
    lastDayOfMonth2.setFullYear(year, monthIndex + 1, 0)
    lastDayOfMonth2.setHours(0, 0, 0, 0)
    return lastDayOfMonth2.getDate()
  }

  // src/isLeapYear/index.ts
  function isLeapYear(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  // src/getDaysInYear/index.ts
  function getDaysInYear(dirtyDate) {
    const date = toDate(dirtyDate)
    if (String(new Date(date)) === 'Invalid Date') {
      return NaN
    }
    return isLeapYear(date) ? 366 : 365
  }

  // src/getDecade/index.ts
  function getDecade(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const decade = Math.floor(year / 10) * 10
    return decade
  }

  // src/getDefaultOptions/index.ts
  function getDefaultOptions2() {
    return assign({}, getDefaultOptions())
  }

  // src/getHours/index.ts
  function getHours(dirtyDate) {
    const date = toDate(dirtyDate)
    const hours = date.getHours()
    return hours
  }

  // src/getISODay/index.ts
  function getISODay(dirtyDate) {
    const date = toDate(dirtyDate)
    let day = date.getDay()
    if (day === 0) {
      day = 7
    }
    return day
  }

  // src/getISOWeeksInYear/index.ts
  function getISOWeeksInYear(dirtyDate) {
    const thisYear = startOfISOWeekYear(dirtyDate)
    const nextYear = startOfISOWeekYear(addWeeks(thisYear, 60))
    const diff = nextYear.valueOf() - thisYear.valueOf()
    return Math.round(diff / millisecondsInWeek)
  }

  // src/getMilliseconds/index.ts
  function getMilliseconds(dirtyDate) {
    const date = toDate(dirtyDate)
    const milliseconds2 = date.getMilliseconds()
    return milliseconds2
  }

  // src/getMinutes/index.ts
  function getMinutes(dirtyDate) {
    const date = toDate(dirtyDate)
    const minutes = date.getMinutes()
    return minutes
  }

  // src/getMonth/index.ts
  function getMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    const month = date.getMonth()
    return month
  }

  // src/getOverlappingDaysInIntervals/index.ts
  function getOverlappingDaysInIntervals(intervalLeft, intervalRight) {
    const leftStartTime = toDate(intervalLeft.start).getTime()
    const leftEndTime = toDate(intervalLeft.end).getTime()
    const rightStartTime = toDate(intervalRight.start).getTime()
    const rightEndTime = toDate(intervalRight.end).getTime()
    if (!(leftStartTime <= leftEndTime && rightStartTime <= rightEndTime)) {
      throw new RangeError('Invalid interval')
    }
    const isOverlapping =
      leftStartTime < rightEndTime && rightStartTime < leftEndTime
    if (!isOverlapping) {
      return 0
    }
    const overlapStartDate =
      rightStartTime < leftStartTime ? leftStartTime : rightStartTime
    const overlapEndDate =
      rightEndTime > leftEndTime ? leftEndTime : rightEndTime
    const differenceInMs = overlapEndDate - overlapStartDate
    return Math.ceil(differenceInMs / millisecondsInDay)
  }

  // src/getSeconds/index.ts
  function getSeconds(dirtyDate) {
    const date = toDate(dirtyDate)
    const seconds = date.getSeconds()
    return seconds
  }

  // src/getTime/index.ts
  function getTime(dirtyDate) {
    const date = toDate(dirtyDate)
    const timestamp = date.getTime()
    return timestamp
  }

  // src/getUnixTime/index.ts
  function getUnixTime(dirtyDate) {
    return Math.floor(getTime(dirtyDate) / 1e3)
  }

  // src/getWeekOfMonth/index.ts
  function getWeekOfMonth(date, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const weekStartsOn =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.weekStartsOn) != null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.weekStartsOn) != null
            ? _d
            : defaultOptions2.weekStartsOn) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.weekStartsOn) != null
        ? _h
        : 0
    const currentDayOfMonth = getDate(date)
    if (isNaN(currentDayOfMonth)) return NaN
    const startWeekDay = getDay(startOfMonth(date))
    let lastDayOfFirstWeek = weekStartsOn - startWeekDay
    if (lastDayOfFirstWeek <= 0) lastDayOfFirstWeek += 7
    const remainingDaysAfterFirstWeek = currentDayOfMonth - lastDayOfFirstWeek
    return Math.ceil(remainingDaysAfterFirstWeek / 7) + 1
  }

  // src/lastDayOfMonth/index.ts
  function lastDayOfMonth(dirtyDate) {
    const date = toDate(dirtyDate)
    const month = date.getMonth()
    date.setFullYear(date.getFullYear(), month + 1, 0)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/getWeeksInMonth/index.ts
  function getWeeksInMonth(date, options) {
    return (
      differenceInCalendarWeeks(
        lastDayOfMonth(date),
        startOfMonth(date),
        options
      ) + 1
    )
  }

  // src/getYear/index.ts
  function getYear(dirtyDate) {
    return toDate(dirtyDate).getFullYear()
  }

  // src/hoursToMilliseconds/index.ts
  function hoursToMilliseconds(hours) {
    return Math.floor(hours * millisecondsInHour)
  }

  // src/hoursToMinutes/index.ts
  function hoursToMinutes(hours) {
    return Math.floor(hours * minutesInHour)
  }

  // src/hoursToSeconds/index.ts
  function hoursToSeconds(hours) {
    return Math.floor(hours * secondsInHour)
  }

  // src/intervalToDuration/index.ts
  function interval(interval2) {
    const start = toDate(interval2.start)
    const end = toDate(interval2.end)
    if (isNaN(start.getTime())) throw new RangeError('Start Date is invalid')
    if (isNaN(end.getTime())) throw new RangeError('End Date is invalid')
    if (start > end) {
      throw new RangeError('The start of an interval cannot be after its end')
    }
    const duration = {
      years: differenceInYears(end, start),
    }
    const remainingMonths = add(start, { years: duration.years })
    duration.months = differenceInMonths(end, remainingMonths)
    const remainingDays = add(remainingMonths, { months: duration.months })
    duration.days = differenceInDays(end, remainingDays)
    const remainingHours = add(remainingDays, { days: duration.days })
    duration.hours = differenceInHours(end, remainingHours)
    const remainingMinutes = add(remainingHours, { hours: duration.hours })
    duration.minutes = differenceInMinutes(end, remainingMinutes)
    const remainingSeconds = add(remainingMinutes, {
      minutes: duration.minutes,
    })
    duration.seconds = differenceInSeconds(end, remainingSeconds)
    return duration
  }

  // src/intlFormat/index.ts
  function intlFormat(date, formatOrLocale, localeOptions) {
    let formatOptions
    if (isFormatOptions(formatOrLocale)) {
      formatOptions = formatOrLocale
    } else {
      localeOptions = formatOrLocale
    }
    return new Intl.DateTimeFormat(
      localeOptions == null ? void 0 : localeOptions.locale,
      formatOptions
    ).format(date)
  }
  function isFormatOptions(opts) {
    return opts !== void 0 && !('locale' in opts)
  }

  // src/intlFormatDistance/index.ts
  function intlFormatDistance(date, baseDate, options) {
    let value = 0
    let unit
    const dateLeft = toDate(date)
    const dateRight = toDate(baseDate)
    if (!(options == null ? void 0 : options.unit)) {
      const diffInSeconds = differenceInSeconds(dateLeft, dateRight)
      if (Math.abs(diffInSeconds) < secondsInMinute) {
        value = differenceInSeconds(dateLeft, dateRight)
        unit = 'second'
      } else if (Math.abs(diffInSeconds) < secondsInHour) {
        value = differenceInMinutes(dateLeft, dateRight)
        unit = 'minute'
      } else if (
        Math.abs(diffInSeconds) < secondsInDay &&
        Math.abs(differenceInCalendarDays(dateLeft, dateRight)) < 1
      ) {
        value = differenceInHours(dateLeft, dateRight)
        unit = 'hour'
      } else if (
        Math.abs(diffInSeconds) < secondsInWeek &&
        (value = differenceInCalendarDays(dateLeft, dateRight)) &&
        Math.abs(value) < 7
      ) {
        unit = 'day'
      } else if (Math.abs(diffInSeconds) < secondsInMonth) {
        value = differenceInCalendarWeeks(dateLeft, dateRight)
        unit = 'week'
      } else if (Math.abs(diffInSeconds) < secondsInQuarter) {
        value = differenceInCalendarMonths(dateLeft, dateRight)
        unit = 'month'
      } else if (Math.abs(diffInSeconds) < secondsInYear) {
        if (differenceInCalendarQuarters(dateLeft, dateRight) < 4) {
          value = differenceInCalendarQuarters(dateLeft, dateRight)
          unit = 'quarter'
        } else {
          value = differenceInCalendarYears(dateLeft, dateRight)
          unit = 'year'
        }
      } else {
        value = differenceInCalendarYears(dateLeft, dateRight)
        unit = 'year'
      }
    } else {
      unit = options == null ? void 0 : options.unit
      if (unit === 'second') {
        value = differenceInSeconds(dateLeft, dateRight)
      } else if (unit === 'minute') {
        value = differenceInMinutes(dateLeft, dateRight)
      } else if (unit === 'hour') {
        value = differenceInHours(dateLeft, dateRight)
      } else if (unit === 'day') {
        value = differenceInCalendarDays(dateLeft, dateRight)
      } else if (unit === 'week') {
        value = differenceInCalendarWeeks(dateLeft, dateRight)
      } else if (unit === 'month') {
        value = differenceInCalendarMonths(dateLeft, dateRight)
      } else if (unit === 'quarter') {
        value = differenceInCalendarQuarters(dateLeft, dateRight)
      } else if (unit === 'year') {
        value = differenceInCalendarYears(dateLeft, dateRight)
      }
    }
    const rtf = new Intl.RelativeTimeFormat(
      options == null ? void 0 : options.locale,
      {
        localeMatcher: options == null ? void 0 : options.localeMatcher,
        numeric: (options == null ? void 0 : options.numeric) || 'auto',
        style: options == null ? void 0 : options.style,
      }
    )
    return rtf.format(value, unit)
  }

  // src/isAfter/index.ts
  function isAfter(dirtyDate, dirtyDateToCompare) {
    const date = toDate(dirtyDate)
    const dateToCompare = toDate(dirtyDateToCompare)
    return date.getTime() > dateToCompare.getTime()
  }

  // src/isBefore/index.ts
  function isBefore(dirtyDate, dirtyDateToCompare) {
    const date = toDate(dirtyDate)
    const dateToCompare = toDate(dirtyDateToCompare)
    return date.getTime() < dateToCompare.getTime()
  }

  // src/isEqual/index.ts
  function isEqual(dirtyLeftDate, dirtyRightDate) {
    const dateLeft = toDate(dirtyLeftDate)
    const dateRight = toDate(dirtyRightDate)
    return dateLeft.getTime() === dateRight.getTime()
  }

  // src/isExists/index.ts
  function isExists(year, month, day) {
    const date = new Date(year, month, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    )
  }

  // src/isFirstDayOfMonth/index.ts
  function isFirstDayOfMonth(dirtyDate) {
    return toDate(dirtyDate).getDate() === 1
  }

  // src/isFriday/index.ts
  function isFriday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 5
  }

  // src/isFuture/index.ts
  function isFuture(dirtyDate) {
    return toDate(dirtyDate).getTime() > Date.now()
  }

  // src/transpose/index.ts
  function transpose(fromDate, constructor) {
    const date =
      constructor instanceof Date
        ? constructFrom(constructor, 0)
        : new constructor(0)
    date.setFullYear(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate()
    )
    date.setHours(
      fromDate.getHours(),
      fromDate.getMinutes(),
      fromDate.getSeconds(),
      fromDate.getMilliseconds()
    )
    return date
  }

  // src/parse/_lib/Setter.ts
  var TIMEZONE_UNIT_PRIORITY = 10
  var Setter = class {
    constructor() {
      this.subPriority = 0
    }
    validate(_utcDate, _options) {
      return true
    }
  }
  var ValueSetter = class extends Setter {
    constructor(value, validateValue, setValue, priority, subPriority) {
      super()
      this.value = value
      this.validateValue = validateValue
      this.setValue = setValue
      this.priority = priority
      if (subPriority) {
        this.subPriority = subPriority
      }
    }
    validate(date, options) {
      return this.validateValue(date, this.value, options)
    }
    set(date, flags, options) {
      return this.setValue(date, flags, this.value, options)
    }
  }
  var DateToSystemTimezoneSetter = class extends Setter {
    constructor() {
      super(...arguments)
      this.priority = TIMEZONE_UNIT_PRIORITY
      this.subPriority = -1
    }
    set(date, flags) {
      if (flags.timestampIsSet) return date
      return constructFrom(date, transpose(date, Date))
    }
  }

  // src/parse/_lib/Parser.ts
  var Parser = class {
    run(dateString, token, match2, options) {
      const result = this.parse(dateString, token, match2, options)
      if (!result) {
        return null
      }
      return {
        setter: new ValueSetter(
          result.value,
          this.validate,
          this.set,
          this.priority,
          this.subPriority
        ),
        rest: result.rest,
      }
    }
    validate(_utcDate, _value, _options) {
      return true
    }
  }

  // src/parse/_lib/parsers/EraParser.ts
  var EraParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 140
      this.incompatibleTokens = ['R', 'u', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'G':
        case 'GG':
        case 'GGG':
          return (
            match2.era(dateString, { width: 'abbreviated' }) ||
            match2.era(dateString, { width: 'narrow' })
          )
        case 'GGGGG':
          return match2.era(dateString, { width: 'narrow' })
        case 'GGGG':
        default:
          return (
            match2.era(dateString, { width: 'wide' }) ||
            match2.era(dateString, { width: 'abbreviated' }) ||
            match2.era(dateString, { width: 'narrow' })
          )
      }
    }
    set(date, flags, value) {
      flags.era = value
      date.setFullYear(value, 0, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/constants.ts
  var numericPatterns = {
    month: /^(1[0-2]|0?\d)/,
    // 0 to 12
    date: /^(3[0-1]|[0-2]?\d)/,
    // 0 to 31
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
    // 0 to 366
    week: /^(5[0-3]|[0-4]?\d)/,
    // 0 to 53
    hour23h: /^(2[0-3]|[0-1]?\d)/,
    // 0 to 23
    hour24h: /^(2[0-4]|[0-1]?\d)/,
    // 0 to 24
    hour11h: /^(1[0-1]|0?\d)/,
    // 0 to 11
    hour12h: /^(1[0-2]|0?\d)/,
    // 0 to 12
    minute: /^[0-5]?\d/,
    // 0 to 59
    second: /^[0-5]?\d/,
    // 0 to 59
    singleDigit: /^\d/,
    // 0 to 9
    twoDigits: /^\d{1,2}/,
    // 0 to 99
    threeDigits: /^\d{1,3}/,
    // 0 to 999
    fourDigits: /^\d{1,4}/,
    // 0 to 9999
    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/,
    // 0 to 9, -0 to -9
    twoDigitsSigned: /^-?\d{1,2}/,
    // 0 to 99, -0 to -99
    threeDigitsSigned: /^-?\d{1,3}/,
    // 0 to 999, -0 to -999
    fourDigitsSigned: /^-?\d{1,4}/,
    // 0 to 9999, -0 to -9999
  }
  var timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/,
  }

  // src/parse/_lib/utils.ts
  function mapValue(parseFnResult, mapFn) {
    if (!parseFnResult) {
      return parseFnResult
    }
    return {
      value: mapFn(parseFnResult.value),
      rest: parseFnResult.rest,
    }
  }
  function parseNumericPattern(pattern, dateString) {
    const matchResult = dateString.match(pattern)
    if (!matchResult) {
      return null
    }
    return {
      value: parseInt(matchResult[0], 10),
      rest: dateString.slice(matchResult[0].length),
    }
  }
  function parseTimezonePattern(pattern, dateString) {
    const matchResult = dateString.match(pattern)
    if (!matchResult) {
      return null
    }
    if (matchResult[0] === 'Z') {
      return {
        value: 0,
        rest: dateString.slice(1),
      }
    }
    const sign = matchResult[1] === '+' ? 1 : -1
    const hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0
    const minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0
    const seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0
    return {
      value:
        sign *
        (hours * millisecondsInHour +
          minutes * millisecondsInMinute +
          seconds * millisecondsInSecond),
      rest: dateString.slice(matchResult[0].length),
    }
  }
  function parseAnyDigitsSigned(dateString) {
    return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString)
  }
  function parseNDigits(n, dateString) {
    switch (n) {
      case 1:
        return parseNumericPattern(numericPatterns.singleDigit, dateString)
      case 2:
        return parseNumericPattern(numericPatterns.twoDigits, dateString)
      case 3:
        return parseNumericPattern(numericPatterns.threeDigits, dateString)
      case 4:
        return parseNumericPattern(numericPatterns.fourDigits, dateString)
      default:
        return parseNumericPattern(new RegExp('^\\d{1,' + n + '}'), dateString)
    }
  }
  function parseNDigitsSigned(n, dateString) {
    switch (n) {
      case 1:
        return parseNumericPattern(
          numericPatterns.singleDigitSigned,
          dateString
        )
      case 2:
        return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString)
      case 3:
        return parseNumericPattern(
          numericPatterns.threeDigitsSigned,
          dateString
        )
      case 4:
        return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString)
      default:
        return parseNumericPattern(
          new RegExp('^-?\\d{1,' + n + '}'),
          dateString
        )
    }
  }
  function dayPeriodEnumToHours(dayPeriod) {
    switch (dayPeriod) {
      case 'morning':
        return 4
      case 'evening':
        return 17
      case 'pm':
      case 'noon':
      case 'afternoon':
        return 12
      case 'am':
      case 'midnight':
      case 'night':
      default:
        return 0
    }
  }
  function normalizeTwoDigitYear(twoDigitYear, currentYear) {
    const isCommonEra = currentYear > 0
    const absCurrentYear = isCommonEra ? currentYear : 1 - currentYear
    let result
    if (absCurrentYear <= 50) {
      result = twoDigitYear || 100
    } else {
      const rangeEnd = absCurrentYear + 50
      const rangeEndCentury = Math.floor(rangeEnd / 100) * 100
      const isPreviousCentury = twoDigitYear >= rangeEnd % 100
      result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0)
    }
    return isCommonEra ? result : 1 - result
  }
  function isLeapYearIndex(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  // src/parse/_lib/parsers/YearParser.ts
  var YearParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 130
      this.incompatibleTokens = [
        'Y',
        'R',
        'u',
        'w',
        'I',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      const valueCallback = (year) => ({
        year,
        isTwoDigitYear: token === 'yy',
      })
      switch (token) {
        case 'y':
          return mapValue(parseNDigits(4, dateString), valueCallback)
        case 'yo':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'year',
            }),
            valueCallback
          )
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback)
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0
    }
    set(date, flags, value) {
      const currentYear = date.getFullYear()
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(
          value.year,
          currentYear
        )
        date.setFullYear(normalizedTwoDigitYear, 0, 1)
        date.setHours(0, 0, 0, 0)
        return date
      }
      const year =
        !('era' in flags) || flags.era === 1 ? value.year : 1 - value.year
      date.setFullYear(year, 0, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/LocalWeekYearParser.ts
  var LocalWeekYearParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 130
      this.incompatibleTokens = [
        'y',
        'R',
        'u',
        'Q',
        'q',
        'M',
        'L',
        'I',
        'd',
        'D',
        'i',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      const valueCallback = (year) => ({
        year,
        isTwoDigitYear: token === 'YY',
      })
      switch (token) {
        case 'Y':
          return mapValue(parseNDigits(4, dateString), valueCallback)
        case 'Yo':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'year',
            }),
            valueCallback
          )
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback)
      }
    }
    validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0
    }
    set(date, flags, value, options) {
      const currentYear = getWeekYear(date, options)
      if (value.isTwoDigitYear) {
        const normalizedTwoDigitYear = normalizeTwoDigitYear(
          value.year,
          currentYear
        )
        date.setFullYear(
          normalizedTwoDigitYear,
          0,
          options.firstWeekContainsDate
        )
        date.setHours(0, 0, 0, 0)
        return startOfWeek(date, options)
      }
      const year =
        !('era' in flags) || flags.era === 1 ? value.year : 1 - value.year
      date.setFullYear(year, 0, options.firstWeekContainsDate)
      date.setHours(0, 0, 0, 0)
      return startOfWeek(date, options)
    }
  }

  // src/parse/_lib/parsers/ISOWeekYearParser.ts
  var ISOWeekYearParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 130
      this.incompatibleTokens = [
        'G',
        'y',
        'Y',
        'u',
        'Q',
        'q',
        'M',
        'L',
        'w',
        'd',
        'D',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token) {
      if (token === 'R') {
        return parseNDigitsSigned(4, dateString)
      }
      return parseNDigitsSigned(token.length, dateString)
    }
    set(date, _flags, value) {
      const firstWeekOfYear = constructFrom(date, 0)
      firstWeekOfYear.setFullYear(value, 0, 4)
      firstWeekOfYear.setHours(0, 0, 0, 0)
      return startOfISOWeek(firstWeekOfYear)
    }
  }

  // src/parse/_lib/parsers/ExtendedYearParser.ts
  var ExtendedYearParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 130
      this.incompatibleTokens = [
        'G',
        'y',
        'Y',
        'R',
        'w',
        'I',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token) {
      if (token === 'u') {
        return parseNDigitsSigned(4, dateString)
      }
      return parseNDigitsSigned(token.length, dateString)
    }
    set(date, _flags, value) {
      date.setFullYear(value, 0, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/QuarterParser.ts
  var QuarterParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 120
      this.incompatibleTokens = [
        'Y',
        'R',
        'q',
        'M',
        'L',
        'w',
        'I',
        'd',
        'D',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'Q':
        case 'QQ':
          return parseNDigits(token.length, dateString)
        case 'Qo':
          return match2.ordinalNumber(dateString, { unit: 'quarter' })
        case 'QQQ':
          return (
            match2.quarter(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.quarter(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
        case 'QQQQQ':
          return match2.quarter(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'QQQQ':
        default:
          return (
            match2.quarter(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
            match2.quarter(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.quarter(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/StandAloneQuarterParser.ts
  var StandAloneQuarterParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 120
      this.incompatibleTokens = [
        'Y',
        'R',
        'Q',
        'M',
        'L',
        'w',
        'I',
        'd',
        'D',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'q':
        case 'qq':
          return parseNDigits(token.length, dateString)
        case 'qo':
          return match2.ordinalNumber(dateString, { unit: 'quarter' })
        case 'qqq':
          return (
            match2.quarter(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.quarter(dateString, {
              width: 'narrow',
              context: 'standalone',
            })
          )
        case 'qqqqq':
          return match2.quarter(dateString, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'qqqq':
        default:
          return (
            match2.quarter(dateString, {
              width: 'wide',
              context: 'standalone',
            }) ||
            match2.quarter(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.quarter(dateString, {
              width: 'narrow',
              context: 'standalone',
            })
          )
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 4
    }
    set(date, _flags, value) {
      date.setMonth((value - 1) * 3, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/MonthParser.ts
  var MonthParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.incompatibleTokens = [
        'Y',
        'R',
        'q',
        'Q',
        'L',
        'w',
        'I',
        'D',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
      this.priority = 110
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => value - 1
      switch (token) {
        case 'M':
          return mapValue(
            parseNumericPattern(numericPatterns.month, dateString),
            valueCallback
          )
        case 'MM':
          return mapValue(parseNDigits(2, dateString), valueCallback)
        case 'Mo':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'month',
            }),
            valueCallback
          )
        case 'MMM':
          return (
            match2.month(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.month(dateString, { width: 'narrow', context: 'formatting' })
          )
        case 'MMMMM':
          return match2.month(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'MMMM':
        default:
          return (
            match2.month(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
            match2.month(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.month(dateString, { width: 'narrow', context: 'formatting' })
          )
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11
    }
    set(date, _flags, value) {
      date.setMonth(value, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/StandAloneMonthParser.ts
  var StandAloneMonthParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 110
      this.incompatibleTokens = [
        'Y',
        'R',
        'q',
        'Q',
        'M',
        'w',
        'I',
        'D',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => value - 1
      switch (token) {
        case 'L':
          return mapValue(
            parseNumericPattern(numericPatterns.month, dateString),
            valueCallback
          )
        case 'LL':
          return mapValue(parseNDigits(2, dateString), valueCallback)
        case 'Lo':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'month',
            }),
            valueCallback
          )
        case 'LLL':
          return (
            match2.month(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.month(dateString, { width: 'narrow', context: 'standalone' })
          )
        case 'LLLLL':
          return match2.month(dateString, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'LLLL':
        default:
          return (
            match2.month(dateString, {
              width: 'wide',
              context: 'standalone',
            }) ||
            match2.month(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.month(dateString, { width: 'narrow', context: 'standalone' })
          )
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11
    }
    set(date, _flags, value) {
      date.setMonth(value, 1)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/setWeek/index.ts
  function setWeek(dirtyDate, week, options) {
    const date = toDate(dirtyDate)
    const diff = getWeek(date, options) - week
    date.setDate(date.getDate() - diff * 7)
    return date
  }

  // src/parse/_lib/parsers/LocalWeekParser.ts
  var LocalWeekParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 100
      this.incompatibleTokens = [
        'y',
        'R',
        'u',
        'q',
        'Q',
        'M',
        'L',
        'I',
        'd',
        'D',
        'i',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'w':
          return parseNumericPattern(numericPatterns.week, dateString)
        case 'wo':
          return match2.ordinalNumber(dateString, { unit: 'week' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53
    }
    set(date, _flags, value, options) {
      return startOfWeek(setWeek(date, value, options), options)
    }
  }

  // src/setISOWeek/index.ts
  function setISOWeek(dirtyDate, isoWeek) {
    const date = toDate(dirtyDate)
    const diff = getISOWeek(date) - isoWeek
    date.setDate(date.getDate() - diff * 7)
    return date
  }

  // src/parse/_lib/parsers/ISOWeekParser.ts
  var ISOWeekParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 100
      this.incompatibleTokens = [
        'y',
        'Y',
        'u',
        'q',
        'Q',
        'M',
        'L',
        'w',
        'd',
        'D',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'I':
          return parseNumericPattern(numericPatterns.week, dateString)
        case 'Io':
          return match2.ordinalNumber(dateString, { unit: 'week' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 53
    }
    set(date, _flags, value) {
      return startOfISOWeek(setISOWeek(date, value))
    }
  }

  // src/parse/_lib/parsers/DateParser.ts
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  var DateParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.subPriority = 1
      this.incompatibleTokens = [
        'Y',
        'R',
        'q',
        'Q',
        'w',
        'I',
        'D',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'd':
          return parseNumericPattern(numericPatterns.date, dateString)
        case 'do':
          return match2.ordinalNumber(dateString, { unit: 'date' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(date, value) {
      const year = date.getFullYear()
      const isLeapYear2 = isLeapYearIndex(year)
      const month = date.getMonth()
      if (isLeapYear2) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month]
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month]
      }
    }
    set(date, _flags, value) {
      date.setDate(value)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/DayOfYearParser.ts
  var DayOfYearParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.subpriority = 1
      this.incompatibleTokens = [
        'Y',
        'R',
        'q',
        'Q',
        'M',
        'L',
        'w',
        'I',
        'd',
        'E',
        'i',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'D':
        case 'DD':
          return parseNumericPattern(numericPatterns.dayOfYear, dateString)
        case 'Do':
          return match2.ordinalNumber(dateString, { unit: 'date' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(date, value) {
      const year = date.getFullYear()
      const isLeapYear2 = isLeapYearIndex(year)
      if (isLeapYear2) {
        return value >= 1 && value <= 366
      } else {
        return value >= 1 && value <= 365
      }
    }
    set(date, _flags, value) {
      date.setMonth(0, value)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/setDay/index.ts
  function setDay(dirtyDate, day, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const weekStartsOn =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.weekStartsOn) != null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.weekStartsOn) != null
            ? _d
            : defaultOptions2.weekStartsOn) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.weekStartsOn) != null
        ? _h
        : 0
    const date = toDate(dirtyDate)
    const currentDay = date.getDay()
    const remainder = day % 7
    const dayIndex = (remainder + 7) % 7
    const delta = 7 - weekStartsOn
    const diff =
      day < 0 || day > 6
        ? day - ((currentDay + delta) % 7)
        : ((dayIndex + delta) % 7) - ((currentDay + delta) % 7)
    return addDays(date, diff)
  }

  // src/parse/_lib/parsers/DayParser.ts
  var DayParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.incompatibleTokens = ['D', 'i', 'e', 'c', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'E':
        case 'EE':
        case 'EEE':
          return (
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
        case 'EEEEE':
          return match2.day(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'EEEEEE':
          return (
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
        case 'EEEE':
        default:
          return (
            match2.day(dateString, { width: 'wide', context: 'formatting' }) ||
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/LocalDayParser.ts
  var LocalDayParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.incompatibleTokens = [
        'y',
        'R',
        'u',
        'q',
        'Q',
        'M',
        'L',
        'I',
        'd',
        'D',
        'E',
        'i',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2, options) {
      const valueCallback = (value) => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7
        return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays
      }
      switch (token) {
        case 'e':
        case 'ee':
          return mapValue(parseNDigits(token.length, dateString), valueCallback)
        case 'eo':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'day',
            }),
            valueCallback
          )
        case 'eee':
          return (
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
        case 'eeeee':
          return match2.day(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'eeeeee':
          return (
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
        case 'eeee':
        default:
          return (
            match2.day(dateString, { width: 'wide', context: 'formatting' }) ||
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.day(dateString, { width: 'short', context: 'formatting' }) ||
            match2.day(dateString, { width: 'narrow', context: 'formatting' })
          )
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/StandAloneLocalDayParser.ts
  var StandAloneLocalDayParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.incompatibleTokens = [
        'y',
        'R',
        'u',
        'q',
        'Q',
        'M',
        'L',
        'I',
        'd',
        'D',
        'E',
        'i',
        'e',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2, options) {
      const valueCallback = (value) => {
        const wholeWeekDays = Math.floor((value - 1) / 7) * 7
        return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays
      }
      switch (token) {
        case 'c':
        case 'cc':
          return mapValue(parseNDigits(token.length, dateString), valueCallback)
        case 'co':
          return mapValue(
            match2.ordinalNumber(dateString, {
              unit: 'day',
            }),
            valueCallback
          )
        case 'ccc':
          return (
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.day(dateString, { width: 'short', context: 'standalone' }) ||
            match2.day(dateString, { width: 'narrow', context: 'standalone' })
          )
        case 'ccccc':
          return match2.day(dateString, {
            width: 'narrow',
            context: 'standalone',
          })
        case 'cccccc':
          return (
            match2.day(dateString, { width: 'short', context: 'standalone' }) ||
            match2.day(dateString, { width: 'narrow', context: 'standalone' })
          )
        case 'cccc':
        default:
          return (
            match2.day(dateString, { width: 'wide', context: 'standalone' }) ||
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'standalone',
            }) ||
            match2.day(dateString, { width: 'short', context: 'standalone' }) ||
            match2.day(dateString, { width: 'narrow', context: 'standalone' })
          )
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 6
    }
    set(date, _flags, value, options) {
      date = setDay(date, value, options)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/setISODay/index.ts
  function setISODay(dirtyDate, day) {
    const date = toDate(dirtyDate)
    const currentDay = getISODay(date)
    const diff = day - currentDay
    return addDays(date, diff)
  }

  // src/parse/_lib/parsers/ISODayParser.ts
  var ISODayParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 90
      this.incompatibleTokens = [
        'y',
        'Y',
        'u',
        'q',
        'Q',
        'M',
        'L',
        'w',
        'd',
        'D',
        'E',
        'e',
        'c',
        't',
        'T',
      ]
    }
    parse(dateString, token, match2) {
      const valueCallback = (value) => {
        if (value === 0) {
          return 7
        }
        return value
      }
      switch (token) {
        case 'i':
        case 'ii':
          return parseNDigits(token.length, dateString)
        case 'io':
          return match2.ordinalNumber(dateString, { unit: 'day' })
        case 'iii':
          return mapValue(
            match2.day(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
              match2.day(dateString, {
                width: 'short',
                context: 'formatting',
              }) ||
              match2.day(dateString, {
                width: 'narrow',
                context: 'formatting',
              }),
            valueCallback
          )
        case 'iiiii':
          return mapValue(
            match2.day(dateString, {
              width: 'narrow',
              context: 'formatting',
            }),
            valueCallback
          )
        case 'iiiiii':
          return mapValue(
            match2.day(dateString, {
              width: 'short',
              context: 'formatting',
            }) ||
              match2.day(dateString, {
                width: 'narrow',
                context: 'formatting',
              }),
            valueCallback
          )
        case 'iiii':
        default:
          return mapValue(
            match2.day(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
              match2.day(dateString, {
                width: 'abbreviated',
                context: 'formatting',
              }) ||
              match2.day(dateString, {
                width: 'short',
                context: 'formatting',
              }) ||
              match2.day(dateString, {
                width: 'narrow',
                context: 'formatting',
              }),
            valueCallback
          )
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 7
    }
    set(date, _flags, value) {
      date = setISODay(date, value)
      date.setHours(0, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/AMPMParser.ts
  var AMPMParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 80
      this.incompatibleTokens = ['b', 'B', 'H', 'k', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'a':
        case 'aa':
        case 'aaa':
          return (
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
        case 'aaaaa':
          return match2.dayPeriod(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'aaaa':
        default:
          return (
            match2.dayPeriod(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/AMPMMidnightParser.ts
  var AMPMMidnightParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 80
      this.incompatibleTokens = ['a', 'B', 'H', 'k', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'b':
        case 'bb':
        case 'bbb':
          return (
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
        case 'bbbbb':
          return match2.dayPeriod(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'bbbb':
        default:
          return (
            match2.dayPeriod(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/DayPeriodParser.ts
  var DayPeriodParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 80
      this.incompatibleTokens = ['a', 'b', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'B':
        case 'BB':
        case 'BBB':
          return (
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
        case 'BBBBB':
          return match2.dayPeriod(dateString, {
            width: 'narrow',
            context: 'formatting',
          })
        case 'BBBB':
        default:
          return (
            match2.dayPeriod(dateString, {
              width: 'wide',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'abbreviated',
              context: 'formatting',
            }) ||
            match2.dayPeriod(dateString, {
              width: 'narrow',
              context: 'formatting',
            })
          )
      }
    }
    set(date, _flags, value) {
      date.setHours(dayPeriodEnumToHours(value), 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/Hour1to12Parser.ts
  var Hour1to12Parser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 70
      this.incompatibleTokens = ['H', 'K', 'k', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'h':
          return parseNumericPattern(numericPatterns.hour12h, dateString)
        case 'ho':
          return match2.ordinalNumber(dateString, { unit: 'hour' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 12
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0)
      } else if (!isPM && value === 12) {
        date.setHours(0, 0, 0, 0)
      } else {
        date.setHours(value, 0, 0, 0)
      }
      return date
    }
  }

  // src/parse/_lib/parsers/Hour0to23Parser.ts
  var Hour0to23Parser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 70
      this.incompatibleTokens = ['a', 'b', 'h', 'K', 'k', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'H':
          return parseNumericPattern(numericPatterns.hour23h, dateString)
        case 'Ho':
          return match2.ordinalNumber(dateString, { unit: 'hour' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 23
    }
    set(date, _flags, value) {
      date.setHours(value, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/Hour0To11Parser.ts
  var Hour0To11Parser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 70
      this.incompatibleTokens = ['h', 'H', 'k', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'K':
          return parseNumericPattern(numericPatterns.hour11h, dateString)
        case 'Ko':
          return match2.ordinalNumber(dateString, { unit: 'hour' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 11
    }
    set(date, _flags, value) {
      const isPM = date.getHours() >= 12
      if (isPM && value < 12) {
        date.setHours(value + 12, 0, 0, 0)
      } else {
        date.setHours(value, 0, 0, 0)
      }
      return date
    }
  }

  // src/parse/_lib/parsers/Hour1To24Parser.ts
  var Hour1To24Parser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 70
      this.incompatibleTokens = ['a', 'b', 'h', 'H', 'K', 't', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'k':
          return parseNumericPattern(numericPatterns.hour24h, dateString)
        case 'ko':
          return match2.ordinalNumber(dateString, { unit: 'hour' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 1 && value <= 24
    }
    set(date, _flags, value) {
      const hours = value <= 24 ? value % 24 : value
      date.setHours(hours, 0, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/MinuteParser.ts
  var MinuteParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 60
      this.incompatibleTokens = ['t', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 'm':
          return parseNumericPattern(numericPatterns.minute, dateString)
        case 'mo':
          return match2.ordinalNumber(dateString, { unit: 'minute' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59
    }
    set(date, _flags, value) {
      date.setMinutes(value, 0, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/SecondParser.ts
  var SecondParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 50
      this.incompatibleTokens = ['t', 'T']
    }
    parse(dateString, token, match2) {
      switch (token) {
        case 's':
          return parseNumericPattern(numericPatterns.second, dateString)
        case 'so':
          return match2.ordinalNumber(dateString, { unit: 'second' })
        default:
          return parseNDigits(token.length, dateString)
      }
    }
    validate(_date, value) {
      return value >= 0 && value <= 59
    }
    set(date, _flags, value) {
      date.setSeconds(value, 0)
      return date
    }
  }

  // src/parse/_lib/parsers/FractionOfSecondParser.ts
  var FractionOfSecondParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 30
      this.incompatibleTokens = ['t', 'T']
    }
    parse(dateString, token) {
      const valueCallback = (value) =>
        Math.floor(value * Math.pow(10, -token.length + 3))
      return mapValue(parseNDigits(token.length, dateString), valueCallback)
    }
    set(date, _flags, value) {
      date.setMilliseconds(value)
      return date
    }
  }

  // src/parse/_lib/parsers/ISOTimezoneWithZParser.ts
  var ISOTimezoneWithZParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 10
      this.incompatibleTokens = ['t', 'T', 'x']
    }
    parse(dateString, token) {
      switch (token) {
        case 'X':
          return parseTimezonePattern(
            timezonePatterns.basicOptionalMinutes,
            dateString
          )
        case 'XX':
          return parseTimezonePattern(timezonePatterns.basic, dateString)
        case 'XXXX':
          return parseTimezonePattern(
            timezonePatterns.basicOptionalSeconds,
            dateString
          )
        case 'XXXXX':
          return parseTimezonePattern(
            timezonePatterns.extendedOptionalSeconds,
            dateString
          )
        case 'XXX':
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString)
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date
      return constructFrom(
        date,
        date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
      )
    }
  }

  // src/parse/_lib/parsers/ISOTimezoneParser.ts
  var ISOTimezoneParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 10
      this.incompatibleTokens = ['t', 'T', 'X']
    }
    parse(dateString, token) {
      switch (token) {
        case 'x':
          return parseTimezonePattern(
            timezonePatterns.basicOptionalMinutes,
            dateString
          )
        case 'xx':
          return parseTimezonePattern(timezonePatterns.basic, dateString)
        case 'xxxx':
          return parseTimezonePattern(
            timezonePatterns.basicOptionalSeconds,
            dateString
          )
        case 'xxxxx':
          return parseTimezonePattern(
            timezonePatterns.extendedOptionalSeconds,
            dateString
          )
        case 'xxx':
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString)
      }
    }
    set(date, flags, value) {
      if (flags.timestampIsSet) return date
      return constructFrom(
        date,
        date.getTime() - getTimezoneOffsetInMilliseconds(date) - value
      )
    }
  }

  // src/parse/_lib/parsers/TimestampSecondsParser.ts
  var TimestampSecondsParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 40
      this.incompatibleTokens = '*'
    }
    parse(dateString) {
      return parseAnyDigitsSigned(dateString)
    }
    set(date, _flags, value) {
      return [constructFrom(date, value * 1e3), { timestampIsSet: true }]
    }
  }

  // src/parse/_lib/parsers/TimestampMillisecondsParser.ts
  var TimestampMillisecondsParser = class extends Parser {
    constructor() {
      super(...arguments)
      this.priority = 20
      this.incompatibleTokens = '*'
    }
    parse(dateString) {
      return parseAnyDigitsSigned(dateString)
    }
    set(date, _flags, value) {
      return [constructFrom(date, value), { timestampIsSet: true }]
    }
  }

  // src/parse/_lib/parsers/index.ts
  var parsers = {
    G: new EraParser(),
    y: new YearParser(),
    Y: new LocalWeekYearParser(),
    R: new ISOWeekYearParser(),
    u: new ExtendedYearParser(),
    Q: new QuarterParser(),
    q: new StandAloneQuarterParser(),
    M: new MonthParser(),
    L: new StandAloneMonthParser(),
    w: new LocalWeekParser(),
    I: new ISOWeekParser(),
    d: new DateParser(),
    D: new DayOfYearParser(),
    E: new DayParser(),
    e: new LocalDayParser(),
    c: new StandAloneLocalDayParser(),
    i: new ISODayParser(),
    a: new AMPMParser(),
    b: new AMPMMidnightParser(),
    B: new DayPeriodParser(),
    h: new Hour1to12Parser(),
    H: new Hour0to23Parser(),
    K: new Hour0To11Parser(),
    k: new Hour1To24Parser(),
    m: new MinuteParser(),
    s: new SecondParser(),
    S: new FractionOfSecondParser(),
    X: new ISOTimezoneWithZParser(),
    x: new ISOTimezoneParser(),
    t: new TimestampSecondsParser(),
    T: new TimestampMillisecondsParser(),
  }

  // src/parse/index.ts
  var formattingTokensRegExp2 =
    /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
  var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g
  var escapedStringRegExp2 = /^'([^]*?)'?$/
  var doubleQuoteRegExp2 = /''/g
  var notWhitespaceRegExp = /\S/
  var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/
  function parse(dateString, formatString, dirtyReferenceDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r
    const defaultOptions2 = getDefaultOptions2()
    const locale2 =
      (_b =
        (_a = options == null ? void 0 : options.locale) != null
          ? _a
          : defaultOptions2.locale) != null
        ? _b
        : en_US_default
    if (!locale2.match) {
      throw new RangeError('locale must contain match property')
    }
    const firstWeekContainsDate =
      (_j =
        (_i =
          (_f =
            (_e = options == null ? void 0 : options.firstWeekContainsDate) !=
            null
              ? _e
              : (_d =
                  (_c = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _c.options) == null
              ? void 0
              : _d.firstWeekContainsDate) != null
            ? _f
            : defaultOptions2.firstWeekContainsDate) != null
          ? _i
          : (_h =
              (_g = defaultOptions2.locale) == null ? void 0 : _g.options) ==
            null
          ? void 0
          : _h.firstWeekContainsDate) != null
        ? _j
        : 1
    const weekStartsOn =
      (_r =
        (_q =
          (_n =
            (_m = options == null ? void 0 : options.weekStartsOn) != null
              ? _m
              : (_l =
                  (_k = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _k.options) == null
              ? void 0
              : _l.weekStartsOn) != null
            ? _n
            : defaultOptions2.weekStartsOn) != null
          ? _q
          : (_p =
              (_o = defaultOptions2.locale) == null ? void 0 : _o.options) ==
            null
          ? void 0
          : _p.weekStartsOn) != null
        ? _r
        : 0
    if (formatString === '') {
      if (dateString === '') {
        return toDate(dirtyReferenceDate)
      } else {
        return constructFrom(dirtyReferenceDate, NaN)
      }
    }
    const subFnOptions = {
      firstWeekContainsDate,
      weekStartsOn,
      locale: locale2,
    }
    const setters = [new DateToSystemTimezoneSetter()]
    const tokens = formatString
      .match(longFormattingTokensRegExp2)
      .map((substring) => {
        const firstCharacter = substring[0]
        if (firstCharacter in longFormatters_default) {
          const longFormatter = longFormatters_default[firstCharacter]
          return longFormatter(substring, locale2.formatLong)
        }
        return substring
      })
      .join('')
      .match(formattingTokensRegExp2)
    const usedTokens = []
    for (let token of tokens) {
      if (
        !(options == null ? void 0 : options.useAdditionalWeekYearTokens) &&
        isProtectedWeekYearToken(token)
      ) {
        throwProtectedError(token, formatString, dateString)
      }
      if (
        !(options == null ? void 0 : options.useAdditionalDayOfYearTokens) &&
        isProtectedDayOfYearToken(token)
      ) {
        throwProtectedError(token, formatString, dateString)
      }
      const firstCharacter = token[0]
      const parser = parsers[firstCharacter]
      if (parser) {
        const { incompatibleTokens } = parser
        if (Array.isArray(incompatibleTokens)) {
          const incompatibleToken = usedTokens.find(
            (usedToken) =>
              incompatibleTokens.includes(usedToken.token) ||
              usedToken.token === firstCharacter
          )
          if (incompatibleToken) {
            throw new RangeError(
              `The format string mustn't contain \`${incompatibleToken.fullToken}\` and \`${token}\` at the same time`
            )
          }
        } else if (parser.incompatibleTokens === '*' && usedTokens.length > 0) {
          throw new RangeError(
            `The format string mustn't contain \`${token}\` and any other token at the same time`
          )
        }
        usedTokens.push({ token: firstCharacter, fullToken: token })
        const parseResult = parser.run(
          dateString,
          token,
          locale2.match,
          subFnOptions
        )
        if (!parseResult) {
          return constructFrom(dirtyReferenceDate, NaN)
        }
        setters.push(parseResult.setter)
        dateString = parseResult.rest
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
          throw new RangeError(
            'Format string contains an unescaped latin alphabet character `' +
              firstCharacter +
              '`'
          )
        }
        if (token === "''") {
          token = "'"
        } else if (firstCharacter === "'") {
          token = cleanEscapedString2(token)
        }
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length)
        } else {
          return constructFrom(dirtyReferenceDate, NaN)
        }
      }
    }
    if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
      return constructFrom(dirtyReferenceDate, NaN)
    }
    const uniquePrioritySetters = setters
      .map((setter) => setter.priority)
      .sort((a, b) => b - a)
      .filter((priority, index, array) => array.indexOf(priority) === index)
      .map((priority) =>
        setters
          .filter((setter) => setter.priority === priority)
          .sort((a, b) => b.subPriority - a.subPriority)
      )
      .map((setterArray) => setterArray[0])
    let date = toDate(dirtyReferenceDate)
    if (isNaN(date.getTime())) {
      return constructFrom(dirtyReferenceDate, NaN)
    }
    const flags = {}
    for (const setter of uniquePrioritySetters) {
      if (!setter.validate(date, subFnOptions)) {
        return constructFrom(dirtyReferenceDate, NaN)
      }
      const result = setter.set(date, flags, subFnOptions)
      if (Array.isArray(result)) {
        date = result[0]
        assign(flags, result[1])
      } else {
        date = result
      }
    }
    return constructFrom(dirtyReferenceDate, date)
  }
  function cleanEscapedString2(input) {
    return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'")
  }

  // src/isMatch/index.ts
  function isMatch(dateString, formatString, options) {
    return isValid(
      parse(dateString, formatString, /* @__PURE__ */ new Date(), options)
    )
  }

  // src/isMonday/index.ts
  function isMonday(date) {
    return toDate(date).getDay() === 1
  }

  // src/isPast/index.ts
  function isPast(dirtyDate) {
    return toDate(dirtyDate).getTime() < Date.now()
  }

  // src/startOfHour/index.ts
  function startOfHour(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setMinutes(0, 0, 0)
    return date
  }

  // src/isSameHour/index.ts
  function isSameHour(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfHour = startOfHour(dirtyDateLeft)
    const dateRightStartOfHour = startOfHour(dirtyDateRight)
    return dateLeftStartOfHour.getTime() === dateRightStartOfHour.getTime()
  }

  // src/isSameWeek/index.ts
  function isSameWeek(dirtyDateLeft, dirtyDateRight, options) {
    const dateLeftStartOfWeek = startOfWeek(dirtyDateLeft, options)
    const dateRightStartOfWeek = startOfWeek(dirtyDateRight, options)
    return dateLeftStartOfWeek.getTime() === dateRightStartOfWeek.getTime()
  }

  // src/isSameISOWeek/index.ts
  function isSameISOWeek(dirtyDateLeft, dirtyDateRight) {
    return isSameWeek(dirtyDateLeft, dirtyDateRight, { weekStartsOn: 1 })
  }

  // src/isSameISOWeekYear/index.ts
  function isSameISOWeekYear(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfYear = startOfISOWeekYear(dirtyDateLeft)
    const dateRightStartOfYear = startOfISOWeekYear(dirtyDateRight)
    return dateLeftStartOfYear.getTime() === dateRightStartOfYear.getTime()
  }

  // src/isSameMinute/index.ts
  function isSameMinute(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfMinute = startOfMinute(dirtyDateLeft)
    const dateRightStartOfMinute = startOfMinute(dirtyDateRight)
    return dateLeftStartOfMinute.getTime() === dateRightStartOfMinute.getTime()
  }

  // src/isSameMonth/index.ts
  function isSameMonth(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    return (
      dateLeft.getFullYear() === dateRight.getFullYear() &&
      dateLeft.getMonth() === dateRight.getMonth()
    )
  }

  // src/isSameQuarter/index.ts
  function isSameQuarter(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfQuarter = startOfQuarter(dirtyDateLeft)
    const dateRightStartOfQuarter = startOfQuarter(dirtyDateRight)
    return (
      dateLeftStartOfQuarter.getTime() === dateRightStartOfQuarter.getTime()
    )
  }

  // src/startOfSecond/index.ts
  function startOfSecond(dirtyDate) {
    const date = toDate(dirtyDate)
    date.setMilliseconds(0)
    return date
  }

  // src/isSameSecond/index.ts
  function isSameSecond(dirtyDateLeft, dirtyDateRight) {
    const dateLeftStartOfSecond = startOfSecond(dirtyDateLeft)
    const dateRightStartOfSecond = startOfSecond(dirtyDateRight)
    return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime()
  }

  // src/isSameYear/index.ts
  function isSameYear(dirtyDateLeft, dirtyDateRight) {
    const dateLeft = toDate(dirtyDateLeft)
    const dateRight = toDate(dirtyDateRight)
    return dateLeft.getFullYear() === dateRight.getFullYear()
  }

  // src/isThisHour/index.ts
  function isThisHour(dirtyDate) {
    return isSameHour(Date.now(), dirtyDate)
  }

  // src/isThisISOWeek/index.ts
  function isThisISOWeek(dirtyDate) {
    return isSameISOWeek(dirtyDate, Date.now())
  }

  // src/isThisMinute/index.ts
  function isThisMinute(dirtyDate) {
    return isSameMinute(Date.now(), dirtyDate)
  }

  // src/isThisMonth/index.ts
  function isThisMonth(dirtyDate) {
    return isSameMonth(Date.now(), dirtyDate)
  }

  // src/isThisQuarter/index.ts
  function isThisQuarter(dirtyDate) {
    return isSameQuarter(Date.now(), dirtyDate)
  }

  // src/isThisSecond/index.ts
  function isThisSecond(dirtyDate) {
    return isSameSecond(Date.now(), dirtyDate)
  }

  // src/isThisWeek/index.ts
  function is(dirtyDate, options) {
    return isSameWeek(dirtyDate, Date.now(), options)
  }

  // src/isThisYear/index.ts
  function isThisYear(dirtyDate) {
    return isSameYear(dirtyDate, Date.now())
  }

  // src/isThursday/index.ts
  function isThursday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 4
  }

  // src/isToday/index.ts
  function isToday(dirtyDate) {
    return isSameDay(dirtyDate, Date.now())
  }

  // src/isTomorrow/index.ts
  function isTomorrow(dirtyDate) {
    return isSameDay(dirtyDate, addDays(Date.now(), 1))
  }

  // src/isTuesday/index.ts
  function isTuesday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 2
  }

  // src/isWednesday/index.ts
  function isWednesday(dirtyDate) {
    return toDate(dirtyDate).getDay() === 3
  }

  // src/isWithinInterval/index.ts
  function isWithinInterval(dirtyDate, interval2) {
    const time = toDate(dirtyDate).getTime()
    const startTime = toDate(interval2.start).getTime()
    const endTime = toDate(interval2.end).getTime()
    if (!(startTime <= endTime)) {
      throw new RangeError('Invalid interval')
    }
    return time >= startTime && time <= endTime
  }

  // src/subDays/index.ts
  function subDays(dirtyDate, amount) {
    return addDays(dirtyDate, -amount)
  }

  // src/isYesterday/index.ts
  function isYesterday(dirtyDate) {
    return isSameDay(dirtyDate, subDays(Date.now(), 1))
  }

  // src/lastDayOfDecade/index.ts
  function lastDayOfDecade(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const decade = 9 + Math.floor(year / 10) * 10
    date.setFullYear(decade + 1, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/lastDayOfWeek/index.ts
  function lastDayOfWeek(dirtyDate, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const weekStartsOn =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.weekStartsOn) != null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.weekStartsOn) != null
            ? _d
            : defaultOptions2.weekStartsOn) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.weekStartsOn) != null
        ? _h
        : 0
    const date = toDate(dirtyDate)
    const day = date.getDay()
    const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + diff)
    return date
  }

  // src/lastDayOfISOWeek/index.ts
  function lastDayOfISOWeek(dirtyDate) {
    return lastDayOfWeek(dirtyDate, { weekStartsOn: 1 })
  }

  // src/lastDayOfISOWeekYear/index.ts
  function lastDayOfISOWeekYear(dirtyDate) {
    const year = getISOWeekYear(dirtyDate)
    const fourthOfJanuary = constructFrom(dirtyDate, 0)
    fourthOfJanuary.setFullYear(year + 1, 0, 4)
    fourthOfJanuary.setHours(0, 0, 0, 0)
    const date = startOfISOWeek(fourthOfJanuary)
    date.setDate(date.getDate() - 1)
    return date
  }

  // src/lastDayOfQuarter/index.ts
  function lastDayOfQuarter(dirtyDate) {
    const date = toDate(dirtyDate)
    const currentMonth = date.getMonth()
    const month = currentMonth - (currentMonth % 3) + 3
    date.setMonth(month, 0)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/lastDayOfYear/index.ts
  function lastDayOfYear(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    date.setFullYear(year + 1, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/lightFormat/index.ts
  var formattingTokensRegExp3 = /(\w)\1*|''|'(''|[^'])+('|$)|./g
  var escapedStringRegExp3 = /^'([^]*?)'?$/
  var doubleQuoteRegExp3 = /''/g
  var unescapedLatinCharacterRegExp3 = /[a-zA-Z]/
  function lightFormat(dirtyDate, formatStr) {
    const originalDate = toDate(dirtyDate)
    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }
    const tokens = formatStr.match(formattingTokensRegExp3)
    if (!tokens) return ''
    const result = tokens
      .map((substring) => {
        if (substring === "''") {
          return "'"
        }
        const firstCharacter = substring[0]
        if (firstCharacter === "'") {
          return cleanEscapedString3(substring)
        }
        const formatter = lightFormatters_default[firstCharacter]
        if (formatter) {
          return formatter(originalDate, substring)
        }
        if (firstCharacter.match(unescapedLatinCharacterRegExp3)) {
          throw new RangeError(
            'Format string contains an unescaped latin alphabet character `' +
              firstCharacter +
              '`'
          )
        }
        return substring
      })
      .join('')
    return result
  }
  function cleanEscapedString3(input) {
    const matches = input.match(escapedStringRegExp3)
    if (!matches) {
      return input
    }
    return matches[1].replace(doubleQuoteRegExp3, "'")
  }

  // src/milliseconds/index.ts
  var daysInYear2 = 365.2425
  function milliseconds({
    years,
    months: months2,
    weeks,
    days: days2,
    hours,
    minutes,
    seconds,
  }) {
    let totalDays = 0
    if (years) totalDays += years * daysInYear2
    if (months2) totalDays += months2 * (daysInYear2 / 12)
    if (weeks) totalDays += weeks * 7
    if (days2) totalDays += days2
    let totalSeconds = totalDays * 24 * 60 * 60
    if (hours) totalSeconds += hours * 60 * 60
    if (minutes) totalSeconds += minutes * 60
    if (seconds) totalSeconds += seconds
    return Math.round(totalSeconds * 1e3)
  }

  // src/millisecondsToHours/index.ts
  function millisecondsToHours(milliseconds2) {
    const hours = milliseconds2 / millisecondsInHour
    return Math.floor(hours)
  }

  // src/millisecondsToMinutes/index.ts
  function millisecondsToMinutes(milliseconds2) {
    const minutes = milliseconds2 / millisecondsInMinute
    return Math.floor(minutes)
  }

  // src/millisecondsToSeconds/index.ts
  function millisecondsToSeconds(milliseconds2) {
    const seconds = milliseconds2 / millisecondsInSecond
    return Math.floor(seconds)
  }

  // src/minutesToHours/index.ts
  function minutesToHours(minutes) {
    const hours = minutes / minutesInHour
    return Math.floor(hours)
  }

  // src/minutesToMilliseconds/index.ts
  function minutesToMilliseconds(minutes) {
    return Math.floor(minutes * millisecondsInMinute)
  }

  // src/minutesToSeconds/index.ts
  function minutesToSeconds(minutes) {
    return Math.floor(minutes * secondsInMinute)
  }

  // src/monthsToQuarters/index.ts
  function monthsToQuarters(months2) {
    const quarters = months2 / monthsInQuarter
    return Math.floor(quarters)
  }

  // src/monthsToYears/index.ts
  function monthsToYears(months2) {
    const years = months2 / monthsInYear
    return Math.floor(years)
  }

  // src/nextDay/index.ts
  function nextDay(date, day) {
    let delta = day - getDay(date)
    if (delta <= 0) delta += 7
    return addDays(date, delta)
  }

  // src/nextFriday/index.ts
  function nextFriday(date) {
    return nextDay(date, 5)
  }

  // src/nextMonday/index.ts
  function nextMonday(date) {
    return nextDay(date, 1)
  }

  // src/nextSaturday/index.ts
  function nextSaturday(date) {
    return nextDay(date, 6)
  }

  // src/nextSunday/index.ts
  function nextSunday(date) {
    return nextDay(date, 0)
  }

  // src/nextThursday/index.ts
  function nextThursday(date) {
    return nextDay(date, 4)
  }

  // src/nextTuesday/index.ts
  function nextTuesday(date) {
    return nextDay(date, 2)
  }

  // src/nextWednesday/index.ts
  function nextWednesday(date) {
    return nextDay(date, 3)
  }

  // src/parseISO/index.ts
  function parseISO(argument, options) {
    var _a
    const additionalDigits =
      (_a = options == null ? void 0 : options.additionalDigits) != null
        ? _a
        : 2
    const dateStrings = splitDateString(argument)
    let date
    if (dateStrings.date) {
      const parseYearResult = parseYear(dateStrings.date, additionalDigits)
      date = parseDate(parseYearResult.restDateString, parseYearResult.year)
    }
    if (!date || isNaN(date.getTime())) {
      return /* @__PURE__ */ new Date(NaN)
    }
    const timestamp = date.getTime()
    let time = 0
    let offset
    if (dateStrings.time) {
      time = parseTime(dateStrings.time)
      if (isNaN(time)) {
        return /* @__PURE__ */ new Date(NaN)
      }
    }
    if (dateStrings.timezone) {
      offset = parseTimezone(dateStrings.timezone)
      if (isNaN(offset)) {
        return /* @__PURE__ */ new Date(NaN)
      }
    } else {
      const dirtyDate = new Date(timestamp + time)
      const result = /* @__PURE__ */ new Date(0)
      result.setFullYear(
        dirtyDate.getUTCFullYear(),
        dirtyDate.getUTCMonth(),
        dirtyDate.getUTCDate()
      )
      result.setHours(
        dirtyDate.getUTCHours(),
        dirtyDate.getUTCMinutes(),
        dirtyDate.getUTCSeconds(),
        dirtyDate.getUTCMilliseconds()
      )
      return result
    }
    return new Date(timestamp + time + offset)
  }
  var patterns = {
    dateTimeDelimiter: /[T ]/,
    timeZoneDelimiter: /[Z ]/i,
    timezone: /([Z+-].*)$/,
  }
  var dateRegex =
    /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/
  var timeRegex =
    /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/
  var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/
  function splitDateString(dateString) {
    const dateStrings = {}
    const array = dateString.split(patterns.dateTimeDelimiter)
    let timeString
    if (array.length > 2) {
      return dateStrings
    }
    if (/:/.test(array[0])) {
      timeString = array[0]
    } else {
      dateStrings.date = array[0]
      timeString = array[1]
      if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
        dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0]
        timeString = dateString.substr(
          dateStrings.date.length,
          dateString.length
        )
      }
    }
    if (timeString) {
      const token = patterns.timezone.exec(timeString)
      if (token) {
        dateStrings.time = timeString.replace(token[1], '')
        dateStrings.timezone = token[1]
      } else {
        dateStrings.time = timeString
      }
    }
    return dateStrings
  }
  function parseYear(dateString, additionalDigits) {
    const regex = new RegExp(
      '^(?:(\\d{4}|[+-]\\d{' +
        (4 + additionalDigits) +
        '})|(\\d{2}|[+-]\\d{' +
        (2 + additionalDigits) +
        '})$)'
    )
    const captures = dateString.match(regex)
    if (!captures) return { year: NaN, restDateString: '' }
    const year = captures[1] ? parseInt(captures[1]) : null
    const century = captures[2] ? parseInt(captures[2]) : null
    return {
      year: century === null ? year : century * 100,
      restDateString: dateString.slice((captures[1] || captures[2]).length),
    }
  }
  function parseDate(dateString, year) {
    if (year === null) return /* @__PURE__ */ new Date(NaN)
    const captures = dateString.match(dateRegex)
    if (!captures) return /* @__PURE__ */ new Date(NaN)
    const isWeekDate = !!captures[4]
    const dayOfYear = parseDateUnit(captures[1])
    const month = parseDateUnit(captures[2]) - 1
    const day = parseDateUnit(captures[3])
    const week = parseDateUnit(captures[4])
    const dayOfWeek = parseDateUnit(captures[5]) - 1
    if (isWeekDate) {
      if (!validateWeekDate(year, week, dayOfWeek)) {
        return /* @__PURE__ */ new Date(NaN)
      }
      return dayOfISOWeekYear(year, week, dayOfWeek)
    } else {
      const date = /* @__PURE__ */ new Date(0)
      if (
        !validateDate(year, month, day) ||
        !validateDayOfYearDate(year, dayOfYear)
      ) {
        return /* @__PURE__ */ new Date(NaN)
      }
      date.setUTCFullYear(year, month, Math.max(dayOfYear, day))
      return date
    }
  }
  function parseDateUnit(value) {
    return value ? parseInt(value) : 1
  }
  function parseTime(timeString) {
    const captures = timeString.match(timeRegex)
    if (!captures) return NaN
    const hours = parseTimeUnit(captures[1])
    const minutes = parseTimeUnit(captures[2])
    const seconds = parseTimeUnit(captures[3])
    if (!validateTime(hours, minutes, seconds)) {
      return NaN
    }
    return (
      hours * millisecondsInHour +
      minutes * millisecondsInMinute +
      seconds * 1e3
    )
  }
  function parseTimeUnit(value) {
    return (value && parseFloat(value.replace(',', '.'))) || 0
  }
  function parseTimezone(timezoneString) {
    if (timezoneString === 'Z') return 0
    const captures = timezoneString.match(timezoneRegex)
    if (!captures) return 0
    const sign = captures[1] === '+' ? -1 : 1
    const hours = parseInt(captures[2])
    const minutes = (captures[3] && parseInt(captures[3])) || 0
    if (!validateTimezone(hours, minutes)) {
      return NaN
    }
    return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute)
  }
  function dayOfISOWeekYear(isoWeekYear, week, day) {
    const date = /* @__PURE__ */ new Date(0)
    date.setUTCFullYear(isoWeekYear, 0, 4)
    const fourthOfJanuaryDay = date.getUTCDay() || 7
    const diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay
    date.setUTCDate(date.getUTCDate() + diff)
    return date
  }
  var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  function isLeapYearIndex2(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }
  function validateDate(year, month, date) {
    return (
      month >= 0 &&
      month <= 11 &&
      date >= 1 &&
      date <= (daysInMonths[month] || (isLeapYearIndex2(year) ? 29 : 28))
    )
  }
  function validateDayOfYearDate(year, dayOfYear) {
    return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex2(year) ? 366 : 365)
  }
  function validateWeekDate(_year, week, day) {
    return week >= 1 && week <= 53 && day >= 0 && day <= 6
  }
  function validateTime(hours, minutes, seconds) {
    if (hours === 24) {
      return minutes === 0 && seconds === 0
    }
    return (
      seconds >= 0 &&
      seconds < 60 &&
      minutes >= 0 &&
      minutes < 60 &&
      hours >= 0 &&
      hours < 25
    )
  }
  function validateTimezone(_hours, minutes) {
    return minutes >= 0 && minutes <= 59
  }

  // src/parseJSON/index.ts
  function parseJSON(dateString) {
    const parts = dateString.match(
      /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/
    )
    if (parts) {
      return new Date(
        Date.UTC(
          +parts[1],
          +parts[2] - 1,
          +parts[3],
          +parts[4] - (+parts[9] || 0) * (parts[8] == '-' ? -1 : 1),
          +parts[5] - (+parts[10] || 0) * (parts[8] == '-' ? -1 : 1),
          +parts[6],
          +((parts[7] || '0') + '00').substring(0, 3)
        )
      )
    }
    return /* @__PURE__ */ new Date(NaN)
  }

  // src/previousDay/index.ts
  function previousDay(date, day) {
    let delta = getDay(date) - day
    if (delta <= 0) delta += 7
    return subDays(date, delta)
  }

  // src/previousFriday/index.ts
  function previousFriday(date) {
    return previousDay(date, 5)
  }

  // src/previousMonday/index.ts
  function previousMonday(date) {
    return previousDay(date, 1)
  }

  // src/previousSaturday/index.ts
  function previousSaturday(date) {
    return previousDay(date, 6)
  }

  // src/previousSunday/index.ts
  function previousSunday(date) {
    return previousDay(date, 0)
  }

  // src/previousThursday/index.ts
  function previousThursday(date) {
    return previousDay(date, 4)
  }

  // src/previousTuesday/index.ts
  function previousTuesday(date) {
    return previousDay(date, 2)
  }

  // src/previousWednesday/index.ts
  function previousWednesday(date) {
    return previousDay(date, 3)
  }

  // src/quartersToMonths/index.ts
  function quartersToMonths(quarters) {
    return Math.floor(quarters * monthsInQuarter)
  }

  // src/quartersToYears/index.ts
  function quartersToYears(quarters) {
    const years = quarters / quartersInYear
    return Math.floor(years)
  }

  // src/roundToNearestMinutes/index.ts
  function roundToNearestMinutes(dirtyDate, options) {
    var _a
    const nearestTo =
      (_a = options == null ? void 0 : options.nearestTo) != null ? _a : 1
    if (nearestTo < 1 || nearestTo > 30) {
      throw new RangeError('`options.nearestTo` must be between 1 and 30')
    }
    const date = toDate(dirtyDate)
    const seconds = date.getSeconds()
    const minutes = date.getMinutes() + seconds / 60
    const roundingMethod = getRoundingMethod(
      options == null ? void 0 : options.roundingMethod
    )
    const roundedMinutes = roundingMethod(minutes / nearestTo) * nearestTo
    const remainderMinutes = minutes % nearestTo
    const addedMinutes = Math.round(remainderMinutes / nearestTo) * nearestTo
    const result = constructFrom(date, date)
    result.setMinutes(roundedMinutes + addedMinutes, 0, 0)
    return result
  }

  // src/secondsToHours/index.ts
  function secondsToHours(seconds) {
    const hours = seconds / secondsInHour
    return Math.floor(hours)
  }

  // src/secondsToMilliseconds/index.ts
  function secondsToMilliseconds(seconds) {
    return seconds * millisecondsInSecond
  }

  // src/secondsToMinutes/index.ts
  function secondsToMinutes(seconds) {
    const minutes = seconds / secondsInMinute
    return Math.floor(minutes)
  }

  // src/setMonth/index.ts
  function setMonth(dirtyDate, month) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const day = date.getDate()
    const dateWithDesiredMonth = constructFrom(dirtyDate, 0)
    dateWithDesiredMonth.setFullYear(year, month, 15)
    dateWithDesiredMonth.setHours(0, 0, 0, 0)
    const daysInMonth = getDaysInMonth(dateWithDesiredMonth)
    date.setMonth(month, Math.min(day, daysInMonth))
    return date
  }

  // src/set/index.ts
  function set(dirtyDate, values) {
    let date = toDate(dirtyDate)
    if (isNaN(date.getTime())) {
      return constructFrom(dirtyDate, NaN)
    }
    if (values.year != null) {
      date.setFullYear(values.year)
    }
    if (values.month != null) {
      date = setMonth(date, values.month)
    }
    if (values.date != null) {
      date.setDate(values.date)
    }
    if (values.hours != null) {
      date.setHours(values.hours)
    }
    if (values.minutes != null) {
      date.setMinutes(values.minutes)
    }
    if (values.seconds != null) {
      date.setSeconds(values.seconds)
    }
    if (values.milliseconds != null) {
      date.setMilliseconds(values.milliseconds)
    }
    return date
  }

  // src/setDate/index.ts
  function setDate(dirtyDate, dayOfMonth) {
    const date = toDate(dirtyDate)
    date.setDate(dayOfMonth)
    return date
  }

  // src/setDayOfYear/index.ts
  function setDayOfYear(dirtyDate, dayOfYear) {
    const date = toDate(dirtyDate)
    date.setMonth(0)
    date.setDate(dayOfYear)
    return date
  }

  // src/setDefaultOptions/index.ts
  function setDefaultOptions2(newOptions) {
    const result = {}
    const defaultOptions2 = getDefaultOptions()
    for (const property in defaultOptions2) {
      if (Object.prototype.hasOwnProperty.call(defaultOptions2, property)) {
        result[property] = defaultOptions2[property]
      }
    }
    for (const property in newOptions) {
      if (Object.prototype.hasOwnProperty.call(newOptions, property)) {
        if (newOptions[property] === void 0) {
          delete result[property]
        } else {
          result[property] = newOptions[property]
        }
      }
    }
    setDefaultOptions(result)
  }

  // src/setHours/index.ts
  function setHours(dirtyDate, hours) {
    const date = toDate(dirtyDate)
    date.setHours(hours)
    return date
  }

  // src/setMilliseconds/index.ts
  function setMilliseconds(dirtyDate, milliseconds2) {
    const date = toDate(dirtyDate)
    date.setMilliseconds(milliseconds2)
    return date
  }

  // src/setMinutes/index.ts
  function setMinutes(dirtyDate, minutes) {
    const date = toDate(dirtyDate)
    date.setMinutes(minutes)
    return date
  }

  // src/setQuarter/index.ts
  function setQuarter(dirtyDate, quarter) {
    const date = toDate(dirtyDate)
    const oldQuarter = Math.floor(date.getMonth() / 3) + 1
    const diff = quarter - oldQuarter
    return setMonth(date, date.getMonth() + diff * 3)
  }

  // src/setSeconds/index.ts
  function setSeconds(dirtyDate, seconds) {
    const date = toDate(dirtyDate)
    date.setSeconds(seconds)
    return date
  }

  // src/setWeekYear/index.ts
  function setWeekYear(dirtyDate, weekYear, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h
    const defaultOptions2 = getDefaultOptions()
    const firstWeekContainsDate =
      (_h =
        (_g =
          (_d =
            (_c = options == null ? void 0 : options.firstWeekContainsDate) !=
            null
              ? _c
              : (_b =
                  (_a = options == null ? void 0 : options.locale) == null
                    ? void 0
                    : _a.options) == null
              ? void 0
              : _b.firstWeekContainsDate) != null
            ? _d
            : defaultOptions2.firstWeekContainsDate) != null
          ? _g
          : (_f =
              (_e = defaultOptions2.locale) == null ? void 0 : _e.options) ==
            null
          ? void 0
          : _f.firstWeekContainsDate) != null
        ? _h
        : 1
    let date = toDate(dirtyDate)
    const diff = differenceInCalendarDays(date, startOfWeekYear(date, options))
    const firstWeek = constructFrom(dirtyDate, 0)
    firstWeek.setFullYear(weekYear, 0, firstWeekContainsDate)
    firstWeek.setHours(0, 0, 0, 0)
    date = startOfWeekYear(firstWeek, options)
    date.setDate(date.getDate() + diff)
    return date
  }

  // src/setYear/index.ts
  function setYear(dirtyDate, year) {
    const date = toDate(dirtyDate)
    if (isNaN(date.getTime())) {
      return constructFrom(dirtyDate, NaN)
    }
    date.setFullYear(year)
    return date
  }

  // src/startOfDecade/index.ts
  function startOfDecade(dirtyDate) {
    const date = toDate(dirtyDate)
    const year = date.getFullYear()
    const decade = Math.floor(year / 10) * 10
    date.setFullYear(decade, 0, 1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/startOfToday/index.ts
  function startOfToday() {
    return startOfDay(Date.now())
  }

  // src/startOfTomorrow/index.ts
  function startOfTomorrow() {
    const now = /* @__PURE__ */ new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const date = /* @__PURE__ */ new Date(0)
    date.setFullYear(year, month, day + 1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/startOfYesterday/index.ts
  function startOfYesterday() {
    const now = /* @__PURE__ */ new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const date = /* @__PURE__ */ new Date(0)
    date.setFullYear(year, month, day - 1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // src/subMonths/index.ts
  function subMonths(dirtyDate, amount) {
    return addMonths(dirtyDate, -amount)
  }

  // src/sub/index.ts
  function sub(date, duration) {
    const {
      years = 0,
      months: months2 = 0,
      weeks = 0,
      days: days2 = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = duration
    const dateWithoutMonths = subMonths(date, months2 + years * 12)
    const dateWithoutDays = subDays(dateWithoutMonths, days2 + weeks * 7)
    const minutestoSub = minutes + hours * 60
    const secondstoSub = seconds + minutestoSub * 60
    const mstoSub = secondstoSub * 1e3
    const finalDate = constructFrom(date, dateWithoutDays.getTime() - mstoSub)
    return finalDate
  }

  // src/subBusinessDays/index.ts
  function subBusinessDays(dirtyDate, amount) {
    return addBusinessDays(dirtyDate, -amount)
  }

  // src/subHours/index.ts
  function subHours(dirtyDate, amount) {
    return addHours(dirtyDate, -amount)
  }

  // src/subMilliseconds/index.ts
  function subMilliseconds(dirtyDate, amount) {
    return addMilliseconds(dirtyDate, -amount)
  }

  // src/subMinutes/index.ts
  function subMinutes(dirtyDate, amount) {
    return addMinutes(dirtyDate, -amount)
  }

  // src/subQuarters/index.ts
  function subQuarters(dirtyDate, amount) {
    return addQuarters(dirtyDate, -amount)
  }

  // src/subSeconds/index.ts
  function subSeconds(dirtyDate, amount) {
    return addSeconds(dirtyDate, -amount)
  }

  // src/subWeeks/index.ts
  function subWeeks(dirtyDate, amount) {
    return addWeeks(dirtyDate, -amount)
  }

  // src/subYears/index.ts
  function subYears(dirtyDate, amount) {
    return addYears(dirtyDate, -amount)
  }

  // src/weeksToDays/index.ts
  function weeksToDays(weeks) {
    return Math.floor(weeks * daysInWeek)
  }

  // src/yearsToMonths/index.ts
  function yearsToMonths(years) {
    return Math.floor(years * monthsInYear)
  }

  // src/yearsToQuarters/index.ts
  function yearsToQuarters(years) {
    return Math.floor(years * quartersInYear)
  }
})()
