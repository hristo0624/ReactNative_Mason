import moment from 'moment'
  
export function daysDiff (fromDate, toDate) {
  const fm = fromDate.startOf('day')
  const tm = toDate.startOf('day')
  return fm.diff(tm, 'days')
}

export function stringDiffDays (s, e) {
  const diff = moment.duration(e.diff(s, 'days'), 'days')
  return diff.humanize(true)
}

export function stringDiffHours (s, e) {
  const delta = e.diff(s, 'hours')
  const diff = moment.duration(delta, delta < 24 ? 'hours' : 'days')
  return diff.humanize(true)
}

export function greating () {
  const hours = moment().hours()
  return hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening'
}
