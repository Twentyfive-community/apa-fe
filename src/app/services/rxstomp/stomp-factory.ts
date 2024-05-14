import {RxStompServiceService} from "./rx-stomp-service.service";
import {myRxStompConfig} from "./stomp-config";

export function rxStompServiceFactory() {
  const rxStomp = new RxStompServiceService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}
