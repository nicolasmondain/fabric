import {filtersCreate} from '../@types/index';

export default [

	{length: 1, actions: ['curvefromfile'], name: 'curve', preview: null, refresh: false, force: 'auto', medias: 'standard'},
	{length: 2, actions: ['curvefromfile', 'screen'], name: 'double exposure', preview: 1, refresh: false, force: 'auto', medias: 'standard'},
	{length: 1, actions: ['multiply'], name: 'double exposure (shoot)', preview: null, refresh: false, force: 'auto', medias: 'session'},
	{length: 1, actions: ['lenticular'], name: 'lenticular', preview: null, refresh: false, force: 'js', medias: 'standard'},
	{length: 1, actions: ['lenticular'], name: 'lenticular (shoot)', preview: null, refresh: false, force: 'js', medias: 'session'},
	{length: 1, actions: ['beautyfilter'], name: 'beauty filter', preview: null, refresh: false, force: 'js', medias: 'standard'}

] as Array<filtersCreate>;
