import { Id } from 'app/core/definitions/key-types';

import { BaseModel } from '../base/base-model';
import { HasAgendaItemId } from '../base/has-agenda-item-id';
import { HasAttachmentIds } from '../base/has-attachment-ids';
import { HasListOfSpeakersId } from '../base/has-list-of-speakers-id';
import { HasMeetingId } from '../base/has-meeting-id';
import { HasTagIds } from '../base/has-tag-ids';

/**
 * Representation of a topic.
 * @ignore
 */
export class Topic extends BaseModel<Topic> {
    public static COLLECTION = `topic`;

    public id: Id;
    public title: string;
    public text: string;

    public constructor(input?: Partial<Topic>) {
        super(Topic.COLLECTION, input);
    }
}
export interface Topic extends HasMeetingId, HasAgendaItemId, HasListOfSpeakersId, HasAttachmentIds, HasTagIds {}
