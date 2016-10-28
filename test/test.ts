import { Expect, Test } from "alsatian";

// import

function fakeMiddlewareFactory(options: any){

}

export class ExampleTestFixture {

  @Test()
  public exampleTest() {
    Expect(1 + 1).toBe(2);
  }
}