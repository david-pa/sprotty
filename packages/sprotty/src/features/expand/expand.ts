/********************************************************************************
 * Copyright (c) 2017-2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable } from 'inversify';
import { Action, CollapseExpandAction as ProtocolCollapseExpandAction, CollapseExpandAllAction as ProtocolCollapseExpandAllAction} from 'sprotty-protocol/lib/actions';
import { SButton } from '../button/model';
import { findParentByFeature } from '../../base/model/smodel-utils';
import { isExpandable } from './model';
import { IButtonHandler } from '../button/button-handler';

/**
 * Sent from the client to the model source to recalculate a diagram when elements
 * are collapsed/expanded by the client.
 *
 * @deprecated Use the declaration from `sprotty-protocol` instead.
 */
export class CollapseExpandAction implements Action,ProtocolCollapseExpandAction {
    static readonly KIND = 'collapseExpand';
    readonly kind = CollapseExpandAction.KIND;

    constructor(public readonly expandIds: string[],
                public readonly collapseIds: string[]) {
    }
}

/**
 * Programmatic action for expanding or collapsing all elements.
 *
 * @deprecated Use the declaration from `sprotty-protocol` instead.
 */
export class CollapseExpandAllAction implements Action,ProtocolCollapseExpandAllAction {
    static readonly KIND = 'collapseExpandAll';
    readonly kind = CollapseExpandAllAction.KIND;

    /**
     * If `expand` is true, all elements are expanded, othewise they are collapsed.
     */
    constructor(public readonly expand: boolean = true) {
    }
}

@injectable()
export class ExpandButtonHandler implements IButtonHandler {
    static TYPE = 'button:expand';

    buttonPressed(button: SButton): Action[] {
        const expandable = findParentByFeature(button, isExpandable);
        if (expandable !== undefined) {
            return [ ProtocolCollapseExpandAction.create({
                expandIds:   expandable.expanded ? [] : [ expandable.id ],
                collapseIds:  expandable.expanded ? [ expandable.id ] : []
            })];
        } else {
            return [];
        }
    }
}
