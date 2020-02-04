import { TestBed } from "@angular/core/testing";

import { CaseListService } from "./case-list.service";
import { CaseId } from "@app/classes/case-id/case-id";

describe("CaseListService", () => {
  var service: CaseListService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(CaseListService);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should add valid case ID to list and keep the list sorted", () => {
    service.addCaseId("ABC1000000000"); // add first
    service.addCaseId("ABC0000000099"); // add to front
    service.addCaseId("ABC0000010000"); // add mid
    service.addCaseId("ABC2000000000"); // add end
    expect(JSON.stringify(service.caseIdList)).toEqual(
      JSON.stringify({
        ABC0000000099: false,
        ABC0000010000: false,
        ABC1000000000: false,
        ABC2000000000: false
      })
    );
  });

  it("should not add invalid case ID to the list", () => {
    expect(() => service.addCaseId("ABC12345")).toThrow("Invalid case ID");
    expect(() => service.addCaseId("ABCD123456789")).toThrow("Invalid case ID");
    expect(() => service.addCaseId("ABC-102342333")).toThrow("Invalid case ID");
  });

  it("should add caseId string array and keep sorted", () => {
    var stringArray: string[] = [
      "ABC1000000000",
      "ABC0000000099",
      "ABC2000000000"
    ];
    service.addCaseIdsStringArray(stringArray);
    expect(JSON.stringify(service.caseIdList)).toEqual(
      JSON.stringify({
        ABC0000000099: false,
        ABC1000000000: false,
        ABC2000000000: false
      })
    );
  });

  it("should throw error when string array contains duplicate case ID", () => {
    var stringArray: string[] = [
      "ABC1000000000",
      "ABC1000000001",
      "ABC1000000000"
    ];
    expect(() => service.addCaseIdsStringArray(stringArray)).toThrow(
      'Failed to add case "ABC1000000000":\n\nABC1000000000 is already in the list'
    );
  });

  it("should add caseId Object array and keep sorted", () => {
    var caseIdObjArray: CaseId[] = [
      new CaseId("ABC2000000000"),
      new CaseId("ABC1000000000"),
      new CaseId("ABC0000000099"),
      new CaseId("ABC0000010000")
    ];
    service.addCaseIdsObjArray(caseIdObjArray);
    expect(JSON.stringify(service.caseIdList)).toEqual(
      JSON.stringify({
        ABC0000000099: false,
        ABC0000010000: false,
        ABC1000000000: false,
        ABC2000000000: false
      })
    );
  });

  it("should empty the list", () => {
    service.caseIdList = {
      ABC0000000099: false,
      ABC0000010000: false,
      ABC1000000000: false,
      ABC2000000000: false
    };
    service.clearCaseIdList();
    expect(Object.keys(service.caseIdList).length).toEqual(0);
  });

  it("should save the list to localStorage", () => {
    localStorage.clear();
    service.caseIdList = {
      ABC0000000099: false,
      ABC0000010000: false,
      ABC1000000000: false,
      ABC2000000000: false
    };
    service.saveListToLocalStorage();
    while (!localStorage.getItem("cachedCaseIdList")); // wait for localStorage to finish saving;
    expect(localStorage.getItem("cachedCaseIdList")).toEqual(
      JSON.stringify([
        "ABC0000000099",
        "ABC0000010000",
        "ABC1000000000",
        "ABC2000000000"
      ])
    );
  });

  it("should load the list from localStorage", () => {
    localStorage.clear();
    localStorage.setItem(
      "cachedCaseIdList",
      JSON.stringify([
        "ABC0000000099",
        "ABC0000010000",
        "ABC1000000000",
        "ABC2000000000"
      ])
    );
    while (!localStorage.getItem("cachedCaseIdList"));
    service.loadListFromLocalStorage();
    expect(JSON.stringify(service.caseIdList)).toEqual(
      JSON.stringify({
        ABC0000000099: false,
        ABC0000010000: false,
        ABC1000000000: false,
        ABC2000000000: false
      })
    );
  });

  it("should show greetings if cachedCaseIdList is empty", () => {
    service.viewControllerSvc.show["greeting"] = false;
    localStorage.clear();
    service.loadListFromLocalStorage();
    expect(service.viewControllerSvc.show["greeting"]).toBeTruthy();
    service.viewControllerSvc.show["greeting"] = false;
    localStorage.setItem("cachedCaseIdList", "[]");
    while (!localStorage.getItem("cachedCaseIdList")); // wait for localStorage to finish saving;
    service.loadListFromLocalStorage();
    expect(service.viewControllerSvc.show["greeting"]).toBeTruthy();
  });
});
