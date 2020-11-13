import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  makeStyles,
  Theme,
} from '@material-ui/core'
import debugFactory from 'debug'
import { Formik } from 'formik'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import * as yup from 'yup'

import TagsApi from 'src/api/TagsApi'
import Layout from 'src/components/Layout'
import LoadingButtonContainer from 'src/components/LoadingButtonContainer'
import TagFormFields from 'src/components/TagFormFields'
import TagsTable from 'src/components/TagsTable'
import { TagFormData, tagToFormData } from 'src/lib/form-data'
import { TagFullNew, tagFullNewSchema } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { isDebugMode } from 'src/utils/general'

const debug = debugFactory('abacus:pages/tags/index.tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
)

const TagsIndexPage = (): JSX.Element => {
  debug('TagsIndexPage#render')
  const classes = useStyles()

  const { isLoading, data: tags, error, reloadRef } = useDataSource(() => TagsApi.findAll(), [])
  useDataLoadingError(error, 'Tags')

  const debugMode = isDebugMode()

  const { enqueueSnackbar } = useSnackbar()

  // Edit Tag Modal
  const [editTagTagId, setEditTagTagId] = useState<number | null>(null)
  const isEditingTag = editTagTagId !== null
  const { isLoading: editTagIsLoading, data: editTagInitialTag, error: editTagError } = useDataSource(async () => {
    return editTagTagId === null ? null : await TagsApi.findById(editTagTagId)
  }, [editTagTagId])
  useDataLoadingError(editTagError, 'Tag to edit')
  const onEditTag = (tagId: number) => {
    setEditTagTagId(tagId)
  }
  const onCancelEditTag = () => {
    setEditTagTagId(null)
  }
  const onSubmitEditTag = async ({ tag }: { tag: TagFormData }) => {
    try {
      if (!editTagTagId) {
        throw new Error(`Missing tagId, this shouldn't happen.`)
      }
      await TagsApi.put(editTagTagId, (tag as unknown) as TagFullNew)
      enqueueSnackbar('Tag Edited!', { variant: 'success' })
      reloadRef.current()
      setEditTagTagId(null)
    } catch (e) /* istanbul ignore next; Shouldn't happen */ {
      console.error(e)
      enqueueSnackbar('Oops! Something went wrong while trying to update your tag.', { variant: 'error' })
    }
  }

  // Add Tag Modal
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false)
  const onAddTag = () => setIsAddingTag(true)
  const onCancelAddTag = () => {
    setIsAddingTag(false)
  }
  const onSubmitAddTag = async ({ tag }: { tag: TagFormData }) => {
    try {
      await TagsApi.create((tag as unknown) as TagFullNew)
      enqueueSnackbar('Tag Added!', { variant: 'success' })
      reloadRef.current()
      setIsAddingTag(false)
    } catch (e) /* istanbul ignore next; Shouldn't happen */ {
      console.error(e)
      enqueueSnackbar('Oops! Something went wrong while trying to add your tag.', { variant: 'error' })
    }
  }

  return (
    <Layout title='Tags'>
      {isLoading && <LinearProgress />}
      {tags && (
        <>
          <TagsTable tags={tags || []} onEditTag={debugMode ? onEditTag : undefined} />
          {debugMode && (
            <div className={classes.actions}>
              <Button variant='contained' color='secondary' onClick={onAddTag}>
                Add Tag
              </Button>
            </div>
          )}
        </>
      )}
      <Dialog open={isEditingTag} fullWidth aria-labelledby='edit-tag-form-dialog-title'>
        <DialogTitle id='edit-tag-form-dialog-title'>Edit Tag</DialogTitle>
        {editTagIsLoading && <LinearProgress />}
        {editTagInitialTag && (
          <Formik
            initialValues={{ tag: tagToFormData(editTagInitialTag) }}
            onSubmit={onSubmitEditTag}
            validationSchema={yup.object({ tag: tagFullNewSchema })}
          >
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit} noValidate>
                <DialogContent>
                  <TagFormFields />
                </DialogContent>
                <DialogActions>
                  <Button onClick={onCancelEditTag} color='primary'>
                    Cancel
                  </Button>
                  <LoadingButtonContainer isLoading={formikProps.isSubmitting}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                    >
                      Save
                    </Button>
                  </LoadingButtonContainer>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </Dialog>
      <Dialog open={isAddingTag} fullWidth aria-labelledby='add-tag-form-dialog-title'>
        <DialogTitle id='add-tag-form-dialog-title'>Add Tag</DialogTitle>
        <Formik
          initialValues={{ tag: tagToFormData({}) }}
          onSubmit={onSubmitAddTag}
          validationSchema={yup.object({ tag: tagFullNewSchema })}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} noValidate>
              <DialogContent>
                <TagFormFields />
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelAddTag} color='primary'>
                  Cancel
                </Button>
                <LoadingButtonContainer isLoading={formikProps.isSubmitting}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                  >
                    Add
                  </Button>
                </LoadingButtonContainer>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Layout>
  )
}

export default TagsIndexPage
