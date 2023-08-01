import bluebird from 'bluebird'
import { jsonSchemaToZod as compile } from 'json-schema-to-zod'
import { casing } from '../../utils'
import { Module, ModuleDef, ReExportSchemaModule } from '../module'
import type * as types from '../typings'

export class EventModule extends Module {
  public static async create(name: string, event: types.EventDefinition): Promise<EventModule> {
    const schema = event.schema ?? {}
    const def: ModuleDef = {
      path: `${name}.ts`,
      exportName: casing.to.camelCase(name),
      content: compile(schema, { name }),
    }
    return new EventModule(def)
  }
}

export class EventsModule extends ReExportSchemaModule {
  public static async create(events: Record<string, types.EventDefinition>): Promise<EventsModule> {
    const eventModules = await bluebird.map(Object.entries(events), async ([eventName, event]) =>
      EventModule.create(eventName, event)
    )

    const inst = new EventsModule({
      exportName: 'events',
    })
    inst.pushDep(...eventModules)
    return inst
  }
}
