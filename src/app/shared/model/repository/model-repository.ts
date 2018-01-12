import {Description} from './description';
import {MethodRepository} from './method-repository';

export class ModelRepository {
    constructor(public method: MethodRepository[], public description: Description) {}
}
