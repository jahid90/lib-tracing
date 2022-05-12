import chalk from 'chalk';
import { Command } from 'commander';

import createClient from './client.js';

const program = new Command();

const runCli = () => {
    program.name('esdb').description('cli to interact with in-memory event store db').version('1.0.0');

    program
        .command('write')
        .description('write an event to the db')
        .requiredOption('-t, --type <type>', 'the type of the event')
        .requiredOption('-s, --streamName <stream>', 'the name of the stream to publish the event to')
        .requiredOption('-d, --data <json string>', 'the data to be stored in the event; will be parsed as json')
        .option('-m, --metadata <json string>', 'the metadata to be stored in the event; will be parsed as json')
        .action(async (_, opts) => {
            const { type, streamName, data, metadata = '{}' } = opts._optionValues;
            const event = {
                type,
                streamName,
                data: JSON.parse(data),
                metadata: JSON.parse(metadata),
            };
            console.debug(chalk.blue(`[debug] received event: ${JSON.stringify(event)}`));
            await store.addEvent(event);
            console.log(chalk.green('[info] event added successfully'));
        });

    program
        .command('read')
        .description('read event(s) from the db')
        .option('-i --id <id>', 'the id of the event')
        .option('-p, --prettyPrint', 'print the output in pretty format')
        .action(async (_, options) => {
            const client = await createClient({ url: null });
            const { id, prettyPrint } = options._optionValues;

            if (id == null) {
                const events = await client.getAllEvents();

                if (prettyPrint) {
                    console.log(chalk.cyan(JSON.stringify(events, null, 2)));
                } else {
                    console.log(chalk.cyan(JSON.stringify(events)));
                }

                return;
            }

            const event = await client.getEvent({ id });
            if (prettyPrint) {
                console.log(chalk.cyan(JSON.stringify(event, null, 2)));
            } else {
                console.log(chalk.cyan(JSON.stringify(event)));
            }
        });

    program.parse();
};

export default runCli;
