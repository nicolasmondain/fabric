import {filtersConfigModule} from '../@types';

import filtersConfigActionTest from './config.action.test';
import filtersConfigSpecific from './config.specific';
import filtersConfigSpecificTest from './config.specific.test';
import filtersConfigStandard from './config.standard';
import filtersConfigStandardTest from './config.standard.test';

const filtersConfig = Object.assign({}, filtersConfigActionTest, filtersConfigSpecific, filtersConfigSpecificTest, filtersConfigStandard, filtersConfigStandardTest);

export default filtersConfig as filtersConfigModule;
