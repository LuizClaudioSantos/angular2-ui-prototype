import { DSpaceObject } from "./dspace-object.model";
import { ObjectUtil } from "../../utilities/commons/object.util";
import { StringUtil } from "../../utilities/commons/string.util";
import { URLHelper } from "../../utilities/url.helper";

/**
 * A model class for a Bitstream. Bitstreams represent files in DSpace.
 */
export class Bitstream extends DSpaceObject {

    /**
     * A link that can be used to download the file this Bitstream represents.
     */
    retrieveLink: string;

    /**
     *
     */
    sizeBytes: number;

    /**
     *
     */
    bundleName: string;
    
    /**
     * what is this variable for? why not use sizeBytes? which is a property name from DSpace
     */
    size: number;
    
    /**
     *
     */
    bundle: string;

    /**
     *
     */
    mimeType: string;

    /**
     * Create a new bitstream
     *
     * @param json
     *      A plain old javascript object representing a bitstream as would be returned
     *      from the rest api. Currently only json.retrieveLink is used, apart from
     *      the standard DSpaceObject properties
     */
    constructor(json?: any) {
        super(json);
        this.type = "bitstream";
        if (ObjectUtil.isNotEmpty(json)) {
            this.mimeType = json.format;
            this.sizeBytes = json.sizeBytes;
            this.bundleName = json.bundleName;
            this.mimeType = json.mimeType;
            if (StringUtil.isNotBlank(json.retrieveLink)) {
                this.retrieveLink = URLHelper.relativeToAbsoluteRESTURL(json.retrieveLink);
                this.mimeType = json.mimeType;
                this.size = json.sizeBytes;
                this.bundle = json.bundleName;
            }
        }
    }

}
