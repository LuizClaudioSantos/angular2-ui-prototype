import { Pageable } from "./pageable.model";
import { Metadatum } from "./metadatum.model";
import { ObjectUtil } from "../../utilities/commons/object.util";

/**
 * A abstract model class for a DSpaceObject.
 */
export abstract class DSpaceObject extends Pageable {

    /**
     * The identifier for this DSpaceObject.
     */
    id: number;

    /**
     * The name for this DSpaceObject.
     */
    name: string;

    /**
     * The handle for this DSpaceObject.
     */
    handle: string;

    /**
     * A link to this DSpaceObject on the REST Api.
     */
    link: string;

    /**
     * A string representing the kind of DSpaceObject, e.g. community, item, …
     */
    type: string;

    /**
     * An array of the metadata for this DSpaceObject.
     * This is protected because we want to restrict how people interact with the metadata
     * e.g, additions to this array (directly) will *NOT* be noticed by angular's change detection!
     */
    protected metadata: Array<Metadatum>;

    /**
     * Create a new DSpaceObject.
     *
     * @param json
     *      A plain old javascript object representing a DSpaceObject as would be returned
     *      from the REST api. It uses json.id, json.name, json.handle, json.link json.type and 
     *      json.metadata
     */
    constructor(json?: any) {
        super(json);
        if (ObjectUtil.isNotEmpty(json)) {
            this.id = json.id;
            this.name = json.name;
            this.handle = json.handle;
            this.link = json.link;
            this.type = json.type;
            if (Array.isArray(json.metadata)) {
                this.metadata = json.metadata.map(metadataJSON => {
                    return new Metadatum(metadataJSON);
                });
            }
        }
    }

    /**
     *
     * @returns {Array<Metadatum>}
     */
    getMetadata(): Array<Metadatum> {
        return this.metadata;
    }

}
