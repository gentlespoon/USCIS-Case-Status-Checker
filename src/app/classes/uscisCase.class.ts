export class UscisCase {
  // id: string;
  type: string = '';
  activity: object = {};

  constructor(obj?: object) {
    if (obj) {
      this.type = obj['type'] ? obj['type'] : '';
      this.activity = {};
      if (obj['activity']) {
        for (let activityTime of Object.keys(obj['activity'])) {
          this.activity[activityTime] = obj['activity'][activityTime];
        }
      }
    }
  }
}

export class CaseActivity {
  status: string = '';
  detail: string = '';
  date: string = '';
  original: string = '';

  constructor(obj?: object) {
    if (obj) {
      this.status = obj['status'] ? obj['status'] : '';
      this.detail = obj['detail'] ? obj['detail'] : '';
      this.date = obj['date'] ? obj['date'] : '';
      this.original = obj['original'] ? obj['original'] : '';
    }
  }
}
