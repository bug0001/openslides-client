import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryService } from 'app/core/core-services/history.service';
import { StorageService } from 'app/core/core-services/storage.service';
import { BaseFilterListService, OsFilter } from 'app/core/ui-services/base-filter-list.service';
import { PollState } from 'app/shared/models/poll/poll-constants';
import { ViewPoll } from 'app/shared/models/poll/view-poll';

@Injectable({
    providedIn: `root`
})
export class PollFilterListService extends BaseFilterListService<ViewPoll> {
    /**
     * set the storage key name
     */
    protected storageKey = `PollList`;

    public constructor(store: StorageService, historyService: HistoryService, private translate: TranslateService) {
        super(store, historyService);
    }

    /**
     * Filter out analog polls
     * @param viewPoll All polls
     */
    protected preFilter(viewPoll: ViewPoll[]): ViewPoll[] | void {
        return viewPoll.filter(poll => !poll.isAnalog);
    }

    /**
     * @returns the filter definition
     */
    protected getFilterDefinitions(): OsFilter<ViewPoll>[] {
        return [
            {
                property: `state`,
                label: this.translate.instant(`State`),
                options: [
                    { condition: PollState.Created, label: this.translate.instant(`created`) },
                    { condition: PollState.Started, label: this.translate.instant(`started`) },
                    { condition: PollState.Finished, label: this.translate.instant(`finished (unpublished)`) },
                    { condition: PollState.Published, label: this.translate.instant(`published`) }
                ]
            },
            {
                property: `hasVoted`,
                label: this.translate.instant(`Votings`),
                options: [
                    { condition: false, label: this.translate.instant(`Voting is currently in progress.`) },
                    { condition: true, label: this.translate.instant(`You have already voted.`) }
                ]
            }
        ];
    }
}
