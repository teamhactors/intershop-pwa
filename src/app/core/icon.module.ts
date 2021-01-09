import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressBook,
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faArrowAltCircleRight,
  faArrowsAlt,
  faBars,
  faCamera,
  faCheck,
  faCog,
  faCogs,
  faColumns,
  faFastForward,
  faGlobeAmericas,
  faHeart,
  faHome,
  faInbox,
  faInfoCircle,
  faList,
  faListAlt,
  faMinus,
  faPaperPlane,
  faPencilAlt,
  faPhone,
  faPlayCircle,
  faPlus,
  faPrint,
  faQuestionCircle,
  faSearch,
  faShoppingCart,
  faSpinner,
  faStar,
  faStarHalf,
  faTh,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUndo,
  faUser,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
})
export class IconModule {
  constructor(library: FaIconLibrary) {
    config.autoAddCss = false;
    library.addIcons(
      faAddressBook,
      faAngleDown,
      faAngleRight,
      faAngleUp,
      faArrowsAlt,
      faArrowAltCircleRight,
      faBars,
      faCamera,
      faCheck,
      faCog,
      faCogs,
      faColumns,
      faGlobeAmericas,
      faHome,
      faInbox,
      faInfoCircle,
      faList,
      faListAlt,
      faMinus,
      faPaperPlane,
      faPencilAlt,
      faPhone,
      faPlayCircle,
      faPlus,
      faPrint,
      faQuestionCircle,
      faSearch,
      faShoppingCart,
      faSpinner,
      faTh,
      faTimes,
      faTimesCircle,
      faTrashAlt,
      faUndo,
      faUser,
      faUserCheck,
      faStar,
      faStarHalf,
      faHeart,
      faFastForward
    );
  }
}
