const { Client } = require('@notionhq/client')
const axios = require('axios');
const fs = require('fs').promises;
const { Parser } = require('i18next-scanner');
const glob = require("glob")
// const translation = require("./translation.js");
const _ = require('lodash');

const NOTION_DATABASE_ID = '27311a2255b848e791ee9c6101af3fe9';
const TOKEN = 'secret_m7wZwX0CfCBvd7ogjNChWOU2dDAtSBHmRf6uMDkhQbt';
const PAGE_ID = '68f608b5a3e94675b6659c8b7a130d2c';
const NOTION_VERSION = '2022-02-22';

const notion = new Client({ auth: TOKEN })

const COMMON_CONFIG = {
    method: 'post',
    url: 'https://api.notion.com/v1/databases/',
    headers: { 
        'Content-Type': 'application/json', 
        'Notion-Version': NOTION_VERSION, 
        'Authorization': `Bearer ${TOKEN}`
    },
};

const PROPERTY = {
  키: '키',
  한국어: '한국어',
  영어: '영어',
  대만어: '대만어',
};

// 노션에 데이터베이스를 생성해준다.
function createDatabase() {
    const data = JSON.stringify({
        "parent": {
          "type": "page_id",
          "page_id": PAGE_ID
        },
        "title": [
          {
            "type": "text",
            "text": {
              "content": "번역 데이터베이스",
              "link": null
            }
          }
        ],
        "properties": {
          [PROPERTY.키]: {
            "title": {}
          },
          [PROPERTY.한국어]: {
            "rich_text": {}
          },
          [[PROPERTY.영어]]: {
              "rich_text": {}
          },
          [[PROPERTY.대만어]]: {
              "rich_text": {}
          },
        }
      });
      
      const config = {
        ...COMMON_CONFIG,
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
}

// 데이터를 추가해주는 함수
async function addItem({ key, korean, english, taiwan }) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        [PROPERTY.키]: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: key,
              },
            },
          ],
        },
        [PROPERTY.한국어]: {
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: korean
                    }
                }
            ]
        },
        [[PROPERTY.영어]]: {
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: english
                    }
                }
            ]
        },
        [[PROPERTY.대만어]]: {
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: taiwan
                    }
                }
            ]
        }
      },
    })
  } catch (error) {
    console.error(error.body)
  }
}

// 현재 데이터를 모두 노션 데이터베이스에 넣어준다.
async function insertCurrentData() {
  for ( const [key, value] of Object.entries(translation) ) {
    console.log('key', key);
    console.log('value', value);
    await addItem({ key: key, korean: value.ko, english: value.en, taiwan: value.tw });
  }
}

// 노션 데이터베이스 조회 후 번역파일 업데이트
async function getDataAndMakeNewTranslation() {
  const result = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
  })

  const data = result.results;

  const newTranslation = {};

  data.forEach(item => {
    newTranslation[item.properties[[PROPERTY.키]]['title'][0]['plain_text']] = {
      ko: item.properties[[PROPERTY.한국어]]['rich_text'][0]['plain_text'],
      en: item.properties[[PROPERTY.영어]]['rich_text'][0]['plain_text'],
      tw: item.properties[[PROPERTY.대만어]]['rich_text'][0]['plain_text'],
    };
  })

  const newTranslationText = `
  export default ${JSON.stringify(newTranslation, null, 2)}
  `;

  await fs.writeFile('./translation.ts', newTranslationText)

  console.log('번역 파일 업데이트 완료');
}

async function checkUnusedTranslationKeys() {
  glob("**/*.tsx", {}, async function (er, filePathNames) {
    const parser = new Parser();
    for (const pathName of filePathNames) {
      let content = '';
      
      content = await fs.readFile(`./${pathName}`, 'utf-8');
      parser
          .parseFuncFromString(content, { list: ['t']})
    }
      const result = parser.get();

      const notionData = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
      })

      const currentTranslationKeys = [];
      
      const data = notionData.results;

      data.forEach((item) => {
        currentTranslationKeys.push(item.properties[[PROPERTY.키]]['title'][0]['plain_text']);
      });

      const currentUsedTranslationKeys = Object.keys(result.en.translation);

      const unUsedTranslationKeys = _.difference(currentTranslationKeys, currentUsedTranslationKeys);

      await fs.writeFile('./unusedTranslationKey.json', `${JSON.stringify(unUsedTranslationKeys, null, 2)}`);
      
      console.log('추출 완료');
  })  
}

getDataAndMakeNewTranslation();
