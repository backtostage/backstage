/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Button, ItemCardHeader, useRouteRef } from '@backstage/core';
import { BackstageTheme, pageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Link,
  makeStyles,
  Popover,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import { generatePath } from 'react-router';
import { rootRouteRef } from '../../routes';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { FavouriteTemplate } from '../FavouriteTemplate/FavouriteTemplate';

const useStyles = makeStyles({
  cardHeader: {
    position: 'relative',
  },
  title: {
    backgroundImage: ({ backgroundImage }: any) => backgroundImage,
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 10,
    '-webkit-box-orient': 'vertical',
  },
});

const useDeprecationStyles = makeStyles(theme => ({
  deprecationIcon: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(3.5),
    padding: '0.25rem',
  },
}));

export type TemplateCardProps = {
  template: TemplateEntityV1alpha1;
  deprecated?: boolean;
};

type TemplateProps = {
  description: string;
  tags: string[];
  title: string;
  type: string;
  name: string;
};

const getTemplateCardProps = (
  template: TemplateEntityV1alpha1,
): TemplateProps & { key: string } => {
  return {
    key: template.metadata.uid!,
    name: template.metadata.name,
    title: `${(template.metadata.title || template.metadata.name) ?? ''}`,
    type: template.spec.type ?? '',
    description: template.metadata.description ?? '-',
    tags: (template.metadata?.tags as string[]) ?? [],
  };
};

const DeprecationWarning = () => {
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const styles = useDeprecationStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const Title = (
    <Typography style={{ padding: 10, maxWidth: 300 }}>
      This template syntax is deprecated. Please follow the documentation{' '}
      <Link href="https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2">
        here
      </Link>{' '}
      to migrate
    </Typography>
  );

  return (
    <div className={styles.deprecationIcon}>
      <WarningIcon onClick={handleClick} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {Title}
      </Popover>
    </div>
  );
};

export const TemplateCard = ({ template, deprecated }: TemplateCardProps) => {
  const backstageTheme = useTheme<BackstageTheme>();
  const rootLink = useRouteRef(rootRouteRef);
  const templateProps = getTemplateCardProps(template);

  const themeId = pageTheme[templateProps.type] ? templateProps.type : 'other';
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles({ backgroundImage: theme.backgroundImage });
  const href = generatePath(`${rootLink()}/templates/:templateName`, {
    templateName: templateProps.name,
  });

  return (
    <Card>
      <CardMedia className={classes.cardHeader}>
        <FavouriteTemplate entity={template} />
        {deprecated && <DeprecationWarning />}
        <ItemCardHeader
          title={templateProps.title}
          subtitle={templateProps.type}
          classes={{ root: classes.title }}
        />
      </CardMedia>
      <CardContent>
        <Box>
          {templateProps.tags?.map(tag => (
            <Chip size="small" label={tag} key={tag} />
          ))}
        </Box>
        <Box className={classes.description}>{templateProps.description}</Box>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          to={href}
          aria-label={`Choose ${templateProps.title} `}
        >
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
